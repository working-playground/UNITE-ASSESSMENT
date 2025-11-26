import bcrypt from "bcrypt";
import { AuthResultDto, LoginDto, RegisterUserDto } from "../common/dto/user.dto";
import { UserRole } from "../common/enums/common";
import { createError } from "../common/errors/simpleError";
import { signAccessToken } from "../middlewares/auth";
import { createUser, findUserByEmail } from "../persistence/mysql/userRepository,";


export async function registerUser(dto: RegisterUserDto): Promise<AuthResultDto> {
    const existingUser = await findUserByEmail(dto.email);
    if (existingUser) {
        throw createError(409, "Email is already in use", "EMAIL_IN_USE");
    }

    const saltRounds: number = 10;
    const passwordHash: string = await bcrypt.hash(dto.password, saltRounds);

    const createdUser = await createUser(dto.name, dto.email, passwordHash, dto.role);

    const token: string = signAccessToken(createdUser.id, createdUser.role);

    const result: AuthResultDto = {
        token,
        user: {
            id: createdUser.id,
            name: createdUser.name,
            email: createdUser.email,
            role: createdUser.role as UserRole
        }
    };

    return result;
}

export async function loginUser(dto: LoginDto): Promise<AuthResultDto> {
    const user = await findUserByEmail(dto.email);
    if (!user) {
        throw createError(401, "Invalid credentials", "INVALID_CREDENTIALS");
    }

    const isPasswordValid: boolean = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
        throw createError(401, "Invalid credentials", "INVALID_CREDENTIALS");
    }

    const token: string = signAccessToken(user.id, user.role);

    const result: AuthResultDto = {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role as UserRole
        }
    };

    return result;
}
