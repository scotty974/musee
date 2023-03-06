import { z } from "zod";

const userValidator = z.object({
    email: z.string().email(),
    password: z.string().min(4),

});

export default userValidator;