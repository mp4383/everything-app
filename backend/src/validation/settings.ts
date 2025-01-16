import { z } from 'zod';

export const settingsSchema = z.object({
  openAiKey: z.string().min(1, 'OpenAI API key is required'),
});

export type SettingsInput = z.infer<typeof settingsSchema>;
