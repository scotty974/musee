import express from "express";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { expressjwt } from "express-jwt";
import createError from "http-errors";
import { fetchAPI } from "../js/fetchAPI.js";
import { getPainting } from "../js/queries.js";
import * as dotenv from "dotenv";
import { object } from "zod";
import natural from "natural";
import unidecode from "unidecode";

dotenv.config();

const router = express.Router();
const prisma = new PrismaClient();

const auth = expressjwt({
  secret: process.env["JWT_KEY"],
  algorithms: ["HS256"],
});

router.post("/subscription/:uuid", auth, async (req, res, next) => {
  const { uuid } = req.params;
  try {
    const data = await fetchAPI(getPainting(uuid), process.env.API_AUTH_TOKEN);

    const PeintureObject = await prisma.painting.create({
      data: {
        uuId: data[0].entityUuid,
        Name: data[0].title,
        Image_url: data[0].fieldVisuels[0].entity.publicUrl,
      },
    });
    let authorName =
      data[0].fieldOeuvreAuteurs[0].entity.fieldAuteurAuteur.entity.name;
    const strName = authorName.split(", ");
    authorName = strName[1] + " " + strName[0];
    const AuteurObject = await prisma.artists.create({
      data: {
        Name: authorName,
        Born_Date:
          data[0].fieldOeuvreAuteurs[0].entity.fieldAuteurAuteur.entity
            .fieldPipDateNaissance.processed,
        Dead_Date:
          data[0].fieldOeuvreAuteurs[0].entity.fieldAuteurAuteur.entity
            .fieldPipDateDeces.processed,
        Painting: { connect: { uuId: data[0].entityUuid } },
      },
    });
    console.log(authorName);
    res.json({ message: "Data sended" });
  } catch (error) {
    next(error);
  }
});

router.get("/artists", async (req, res, next) => {
  try {
    const games = await prisma.artists.findMany({});
    res.json(games);
  } catch (error) {
    return res.status(400).json({ errors: error.issues });
  }
});

router.get("/artists/:id", async (req, res, next) => {
  const id = parseInt(req.params.id);
  try {
    const games = await prisma.artists.findFirst({
      where: {
        id: id,
      },
    });
    res.json(games);
  } catch (error) {
    return res.status(404).json({ errors: error.issues });
  }
});
router.get("/artists/:id/paints", async (req, res, next) => {
  const id = parseInt(req.params.id);
  try {
    const games = await prisma.artists.findFirst({
      where: {
        id: id,
      },
      include: {
        Painting: true,
      },
    });
    res.json(games);
  } catch (error) {
    return res.status(404).json({ errors: error.issues });
  }
});

router.get("/random", async (req, res, next) => {
  try {
    // Récupérer tous les artistes
    const allArtists = await prisma.artists.findMany();
    // Sélectionner 4 artistes aléatoires
    const randomArtists = [];
    for (let i = 0; i < 4; i++) {
      const randomIndex = Math.floor(Math.random() * allArtists.length);
      randomArtists.push(allArtists[randomIndex]);
    }
    console.log(allArtists);
    res.json({ artists: randomArtists });
  } catch (error) {
    next(error);
  }
});

router.get("/artists/:query/paints/random", async (req, res, next) => {
  try {
    const searchQuery = req.params.query;
    const artists = await prisma.artists.findMany({
      where: {
        Name: { contains: searchQuery }
      },
      include: {
        Painting: true,
      }
    });
    const paintings = artists.map(artist => artist.Painting);
    const randomIndex = Math.floor(Math.random() * paintings.length);
    const randomPainting = paintings[randomIndex];
    res.json(randomPainting);
  } catch (error) {
    return res.status(400).json({ errors: error.issues });
  }
});

router.get("/paints", async (req, res, next) => {
  try {
    const paints = await prisma.painting.findMany({
      where: {},
    });
    res.json(paints);
  } catch (error) {
    next(error);
  }
});
router.get("/paints/:id", async (req, res, next) => {
  const id = parseInt(req.params.id);
  try {
    const paints = await prisma.painting.findFirst({
      where: {
        id: id,
      },
    });
    res.json(paints);
  } catch (error) {
    return res.status(404).json({ errors: error.issues });
  }
});
export default router;
