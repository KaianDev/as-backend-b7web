import { RequestHandler } from "express";
import * as people from "../services/people";
import { z } from "zod";
import { decryptMatch } from "../utils/match";

export const getAll: RequestHandler = async (req, res) => {
    const { id_event, id_group } = req.params;

    const items = await people.getAll({
        id_event: parseInt(id_event),
        id_group: parseInt(id_group),
    });

    if (!items) return res.json({ error: "Ocorreu um erro" });
    res.json({ people: items });
};

export const getOne: RequestHandler = async (req, res) => {
    const { id, id_event, id_group } = req.params;

    const item = await people.getOne({
        id: parseInt(id),
        id_event: parseInt(id_event),
        id_group: parseInt(id_group),
    });

    if (!item) return res.json({ error: "Ocorreu um erro" });
    res.json({ person: item });
};

export const add: RequestHandler = async (req, res) => {
    const { id_event, id_group } = req.params;

    const addSchema = z.object({
        name: z.string(),
        cpf: z.string().transform((val) => val.replace(/\.|-/gm, "")),
    });

    const body = addSchema.safeParse(req.body);
    if (!body.success)
        return res.status(400).json({ error: "Dados inválidos" });
    const newPerson = await people.add({
        name: body.data.name,
        cpf: body.data.cpf,
        id_event: parseInt(id_event),
        id_group: parseInt(id_group),
    });

    if (!newPerson) return res.json({ error: "Ocorreu um erro" });
    res.status(201).json({ person: newPerson });
};

export const update: RequestHandler = async (req, res) => {
    const { id, id_event, id_group } = req.params;
    const updateSchema = z.object({
        name: z.string().optional(),
        cpf: z
            .string()
            .transform((val) => val.replaceAll(".", "").replaceAll("-", ""))
            .optional(),
        matched: z.string().optional(),
    });
    const body = updateSchema.safeParse(req.body);
    if (!body.success)
        return res.status(400).json({ error: "Dados inválidos" });
    const updatedPerson = await people.update(
        {
            id: parseInt(id),
            id_event: parseInt(id_event),
            id_group: parseInt(id_group),
        },
        body.data
    );
    if (!updatedPerson) return res.json({ error: "Ocorreu um erro" });
    const personItem = await people.getOne({
        id_event: parseInt(id_event),
        id: parseInt(id),
    });
    res.json({ person: personItem });
};

export const remove: RequestHandler = async (req, res) => {
    const { id, id_event, id_group } = req.params;
    const removedPerson = await people.remove({
        id: parseInt(id),
        id_event: parseInt(id_event),
        id_group: parseInt(id_group),
    });

    if (!removedPerson) return res.json({ error: "Ocorreu um erro" });
    res.json({ person: removedPerson });
};

export const search: RequestHandler = async (req, res) => {
    const { id_event } = req.params;
    const searchPersonSchema = z.object({
        cpf: z.string().transform((val) => val.replace(/\.|-/gm, "")),
    });
    const query = searchPersonSchema.safeParse(req.query);
    if (!query.success) return res.json({ error: "Dados inválidos" });
    const person = await people.getOne({
        id_event: parseInt(id_event),
        cpf: query.data.cpf,
    });

    if (person) {
        const match = person.matched;
        const matchId = decryptMatch(match);
        const matchedPerson = await people.getOne({
            id: matchId,
            id_event: parseInt(id_event),
        });

        if (matchedPerson) {
            return res.json({
                person: {
                    name: person.name,
                },
                matched: {
                    name: matchedPerson.name,
                },
            });
        }
    }

    res.json({ error: "Ocorreu um erro" });
};
