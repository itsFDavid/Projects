import { prodEnviroment } from "./prodEnviroment"
import { localEnviroment } from "./localEnviroment"

export const config ={
    enviroments:{
        local: localEnviroment,
        prod: prodEnviroment
    }
}