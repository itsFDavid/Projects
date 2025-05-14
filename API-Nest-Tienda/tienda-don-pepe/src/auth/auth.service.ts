import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ClientesService } from 'src/clientes/clientes.service';
import { RegisterUserDto } from './dto/register-user.dto';
import * as bcrypt  from 'bcryptjs';
import { Cliente } from 'src/clientes/entities/cliente.entity';
import { CreateClienteDto } from 'src/clientes/dto/create-cliente.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Repository } from 'typeorm';
import { Users } from './entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    @InjectRepository(Cliente)
    private readonly clientesRepository: Repository<Cliente>,
    private readonly clientesService: ClientesService,
    private readonly jwtService: JwtService
  ){}

  async registerUser(registerUserDto: RegisterUserDto){
    try {
      const { nombre, password, email } = registerUserDto;

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new user object
      const newUser: CreateClienteDto = {
        nombre_cliente: nombre,
        apellido1: registerUserDto.apellido1,
        apellido2: registerUserDto.apellido2,
        email,
      };
      
      // Check if the user already exists
      const existingUser = await this.userRepository.findOne({ where: { email } });
      if (existingUser) {
        throw new NotFoundException('User already exists');
      }
      // Create a new user entity
      const userEntity = this.userRepository.create({
        nombre,
        apellido1: registerUserDto.apellido1,
        apellido2: registerUserDto.apellido2,
        role: registerUserDto.role,
        email,
        password: hashedPassword,
      });
      // Create a new client
      const newClient = await this.clientesService.create(newUser);
  
      // Save the user to the database
      await this.userRepository.save(userEntity);
  
      return {
        message: 'User registered successfully',
      };
    } catch (error) {
      console.log(error);
      // si el email ya existe, lanzamos una excepcion
      if (error.message === 'User already exists') {
        throw new NotFoundException('User already exists');
      }
      // si el error es otro, lanzamos una excepcion generica
      throw new NotFoundException(`Error al crear el usuario`);
    }
  }


  async loginUser(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    // Find the user by email
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      // credenciales incorrectas
      throw new UnauthorizedException('Credenciales incorrectas');
    }
    // Compare the password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const client = await this.clientesRepository.findOne({ where: { email: user.email } });
    if (!client) {
      throw new NotFoundException('Cliente no encontrado');
    }
    // Generate a JWT token
    const token = this.jwtService.sign({ id: client.id_cliente, email: user.email });
    // Return the user data without the password and id
    const { password: _, ...userWithoutPassword } = user;


    const returnData = {
      nombre: user.nombre,
      apellido1: user.apellido1,
      apellido2: user.apellido2,
      email: user.email,
      role: user.role,
      token,
      id: client.id_cliente,
    };

    return {
      ...returnData,
    };
  }

  async validateToken(token: string) {
    try {
      const payload = await this.jwtService.verify(token);
      const user = await this.userRepository.findOne({ where: { email: payload.email } });
      if (!user) {
        throw new UnauthorizedException('Usuario no encontrado');
      }
      // Generate a new token
      const newToken = this.jwtService.sign({ id: user.id, email: user.email });
      return { user, newToken };
    } catch (error) {
      throw new UnauthorizedException('Token inválido');
    }
  }
}
