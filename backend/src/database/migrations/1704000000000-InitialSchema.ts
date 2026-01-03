import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Initial database schema for horoscope application
 */
export class InitialSchema1704000000000 implements MigrationInterface {
  name = 'InitialSchema1704000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Enable UUID extension
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // Create users table
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid DEFAULT uuid_generate_v4() NOT NULL,
        "email" character varying,
        "password" character varying,
        "name" character varying NOT NULL,
        "gender" character varying(10) NOT NULL,
        "birthDate" date NOT NULL,
        "birthTime" character varying,
        "birthPlace" character varying,
        "interests" text,
        "quizAnswers" jsonb,
        "natalChart" jsonb,
        "subscriptionTier" character varying(20) DEFAULT 'free' NOT NULL,
        "createdAt" TIMESTAMP DEFAULT now() NOT NULL,
        "updatedAt" TIMESTAMP DEFAULT now() NOT NULL,
        CONSTRAINT "UQ_users_email" UNIQUE ("email"),
        CONSTRAINT "PK_users" PRIMARY KEY ("id")
      )
    `);

    // Create subscriptions table
    await queryRunner.query(`
      CREATE TABLE "subscriptions" (
        "id" uuid DEFAULT uuid_generate_v4() NOT NULL,
        "userId" uuid NOT NULL,
        "tier" character varying(20) NOT NULL,
        "status" character varying(20) DEFAULT 'active' NOT NULL,
        "startDate" TIMESTAMP NOT NULL,
        "endDate" TIMESTAMP,
        "trialEndDate" TIMESTAMP,
        "stripeCustomerId" character varying,
        "stripeSubscriptionId" character varying,
        "paymentMethod" character varying(20),
        "monthlyPrice" decimal(10,2),
        "currency" character varying(3) DEFAULT 'BRL' NOT NULL,
        "autoRenew" boolean DEFAULT false NOT NULL,
        "features" jsonb,
        "createdAt" TIMESTAMP DEFAULT now() NOT NULL,
        "updatedAt" TIMESTAMP DEFAULT now() NOT NULL,
        CONSTRAINT "PK_subscriptions" PRIMARY KEY ("id"),
        CONSTRAINT "FK_subscriptions_user" FOREIGN KEY ("userId")
          REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    // Create indexes
    await queryRunner.query(`CREATE INDEX "IDX_users_email" ON "users" ("email")`);
    await queryRunner.query(`CREATE INDEX "IDX_users_birthDate" ON "users" ("birthDate")`);
    await queryRunner.query(`CREATE INDEX "IDX_subscriptions_userId" ON "subscriptions" ("userId")`);
    await queryRunner.query(`CREATE INDEX "IDX_subscriptions_status" ON "subscriptions" ("status")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_subscriptions_status"`);
    await queryRunner.query(`DROP INDEX "IDX_subscriptions_userId"`);
    await queryRunner.query(`DROP INDEX "IDX_users_birthDate"`);
    await queryRunner.query(`DROP INDEX "IDX_users_email"`);
    await queryRunner.query(`DROP TABLE "subscriptions"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
