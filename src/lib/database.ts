/**
 * PostgreSQL schema for Metal My Mini on the shared Supabase database.
 * Must match the schema declared in prisma/schema.prisma.
 */
export function getDatabaseSchema() {
  return process.env.NEXT_PUBLIC_SUPABASE_SCHEMA ?? process.env.DATABASE_SCHEMA ?? "metal";
}

export function getPostgresSearchPath() {
  return `-c search_path=${getDatabaseSchema()},public`;
}
