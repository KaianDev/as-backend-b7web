import { RequestHandler } from "express";
import * as events from "../services/events";
import * as people from "../services/people";
import { z } from "zod";

export const getAll: RequestHandler = async (req, res) => {
    const items = await events.getAll();
    if (!items) return res.json({ error: "Ocorreu um erro!" });
    res.json({ events: items });
};

export const getOne: RequestHandler = async (req, res) => {
    const { id } = req.params;
    const items = await events.getOne(parseInt(id));
    if (!items) return res.json({ error: "Ocorreu um erro!" });
    res.json({ events: items });
};

export const add: RequestHandler = async (req, res) => {
    const addSchema = z.object({
        title: z.string(),
        description: z.string(),
        grouped: z.boolean(),
    });

    const body = addSchema.safeParse(req.body);
    if (!body.success)
        return res.status(400).json({ error: "Dados inválidos!" });

    const createdItem = await events.add(body.data);
    if (!createdItem) return res.json({ error: "Ocorreu um erro!" });
    res.json({ events: createdItem });
};

export const update: RequestHandler = async (req, res) => {
    const { id } = req.params;

    const updateEventSchema = z.object({
        status: z.boolean().optional(),
        title: z.string().optional(),
        description: z.string().optional(),
        grouped: z.boolean().optional(),
    });

    const body = updateEventSchema.safeParse(req.body);
    if (!body.success)
        return res.status(400).json({ error: "Dados inválidos!" });

    const updatedItem = await events.update(parseInt(id), body.data);

    if (updatedItem) {
        if (updatedItem.status) {
            // TODO: fazer sorteio
            const results = events.doMatches(parseInt(id));
            if (!results)
                return res.json({ error: "Grupos impossíveis de sortear!" });
        } else {
            // TODO: limpar o sorteio
            await people.update({ id_event: parseInt(id) }, { matched: "" });
        }
        return res.json({ event: updatedItem });
    }

    res.json({ error: "Ocorreu um erro" });
};

export const remove: RequestHandler = async (req, res) => {
    const { id } = req.params;

    const removedItem = await events.remove(parseInt(id));
    if (!removedItem) return res.json({ error: "Ocorreu um erro" });

    res.json({ event: removedItem });
};
