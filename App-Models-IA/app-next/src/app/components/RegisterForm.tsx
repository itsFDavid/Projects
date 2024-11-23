import { useState } from 'react';

interface RegisterResponse {
  token: string;
}

const RegisterForm = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/register', { // Llamada a tu API
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      
      const data: RegisterResponse = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al registrar el usuario');
      }

      // Aquí puedes guardar el token en localStorage o cookies
      localStorage.setItem('token', data.token); // Suponiendo que el token viene en la respuesta

      // Redirigir al usuario
      // router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Registrando...' : 'Registrar'}
      </button>
      {error && <p>{error}</p>}
    </form>
  );
};

export default RegisterForm;
