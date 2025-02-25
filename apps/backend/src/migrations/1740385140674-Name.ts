import { MigrationInterface, QueryRunner } from "typeorm";

export class Name1740385140674 implements MigrationInterface {
    name = 'Name1740385140674'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."game_session_status_enum" AS ENUM('waiting', 'in_progress', 'finished')`);
        await queryRunner.query(`CREATE TABLE "game_session" ("id" SERIAL NOT NULL, "playerOneToken" character varying NOT NULL, "playerTwoToken" character varying, "boardState" jsonb NOT NULL, "rows" integer NOT NULL, "cols" integer NOT NULL, "status" "public"."game_session_status_enum" NOT NULL DEFAULT 'waiting', "winnerToken" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_22f17b262149585d6bb8152e1fe" UNIQUE ("playerOneToken"), CONSTRAINT "UQ_258ca52acde2202bb30f68f0022" UNIQUE ("playerTwoToken"), CONSTRAINT "PK_58b630233711ccafbb0b2a904fc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "game_move" ("id" SERIAL NOT NULL, "playerToken" character varying NOT NULL, "row" integer NOT NULL, "col" integer NOT NULL, "isDiamond" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "sessionId" integer, CONSTRAINT "PK_8d03ecbdc321ca0d1187312bd8c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "game_move" ADD CONSTRAINT "FK_36ee895f4c09ea1501a620963bc" FOREIGN KEY ("sessionId") REFERENCES "game_session"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "game_move" DROP CONSTRAINT "FK_36ee895f4c09ea1501a620963bc"`);
        await queryRunner.query(`DROP TABLE "game_move"`);
        await queryRunner.query(`DROP TABLE "game_session"`);
        await queryRunner.query(`DROP TYPE "public"."game_session_status_enum"`);
    }

}
