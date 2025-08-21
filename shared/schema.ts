import { z } from "zod";

// User schema
export const userSchema = z.object({
  id: z.string(),
  uid: z.string(), // Firebase auth UID
  username: z.string(),
  displayName: z.string(),
  createdAt: z.date(),
});

export type User = z.infer<typeof userSchema>;

export const insertUserSchema = userSchema.omit({ 
  id: true, 
  createdAt: true 
});
export type InsertUser = z.infer<typeof insertUserSchema>;

// Pokemon schemas
export const pokemonStatsSchema = z.object({
  H: z.number(),
  A: z.number(),
  B: z.number(),
  C: z.number(),
  D: z.number(),
  S: z.number(),
});

export const pokemonSchema = z.object({
  id: z.string(),
  name: z.string(),
  level: z.number().default(50),
  item: z.string().default("なし"),
  ability: z.string(),
  teraType: z.string().default("なし"),
  nature: z.string().default("がんばりや"),
  ivs: pokemonStatsSchema,
  evs: pokemonStatsSchema,
  moves: z.array(z.string()).length(4),
  boosts: z.object({
    A: z.number().default(0),
    B: z.number().default(0),
    C: z.number().default(0),
    D: z.number().default(0),
    S: z.number().default(0),
  }),
  natureModifiers: z.object({
    A: z.number().default(1.0),
    B: z.number().default(1.0),
    C: z.number().default(1.0),
    D: z.number().default(1.0),
    S: z.number().default(1.0),
  }),
  isShiny: z.boolean().default(false),
});

export type Pokemon = z.infer<typeof pokemonSchema>;
export type PokemonStats = z.infer<typeof pokemonStatsSchema>;

// Team schema
export const teamSchema = z.object({
  id: z.string(),
  name: z.string(),
  pokemons: z.array(pokemonSchema).max(6),
  userId: z.string(),
  isPublic: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Team = z.infer<typeof teamSchema>;

// Chat schemas
export const messageSchema = z.object({
  id: z.string(),
  text: z.string(),
  senderId: z.string(),
  senderName: z.string(),
  timestamp: z.date(),
  type: z.enum(["text", "battle_result", "team_share"]),
  battleData: z.object({
    attacker: z.string(),
    defender: z.string(),
    move: z.string(),
    damage: z.number(),
    effectiveness: z.string(),
  }).optional(),
  teamData: z.string().optional(), // Base64 encoded team data
});

export type Message = z.infer<typeof messageSchema>;

export const chatSchema = z.object({
  id: z.string(),
  users: z.array(z.string()),
  type: z.enum(["dm", "group"]),
  name: z.string().optional(),
  createdAt: z.date(),
});

export type Chat = z.infer<typeof chatSchema>;

// Group schemas for enhanced team collaboration
export const groupSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  ownerId: z.string(),
  memberIds: z.array(z.string()),
  isPrivate: z.boolean().default(false),
  createdAt: z.date(),
});

export type Group = z.infer<typeof groupSchema>;

export const groupInviteSchema = z.object({
  id: z.string(),
  groupId: z.string(),
  inviterId: z.string(),
  inviteeId: z.string(),
  status: z.enum(['pending', 'accepted', 'rejected']),
  createdAt: z.date(),
});

export type GroupInvite = z.infer<typeof groupInviteSchema>;

// Friendship schema
export const friendshipSchema = z.object({
  id: z.string(),
  users: z.array(z.string()).length(2),
  status: z.enum(["pending", "accepted"]),
  requestedBy: z.string(),
  createdAt: z.date(),
});

export type Friendship = z.infer<typeof friendshipSchema>;
