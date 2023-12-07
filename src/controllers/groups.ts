import { RequestHandler } from "express";
import * as groups from "../services/groups";
import { z } from "zod";

export const getAll: RequestHandler = async (req, res) => {
    const { id_event } = req.params;
    const items = await groups.getAll(parseInt(id_event));
    if (!items) return res.json({ error: "Ocorreu um erro" });
    res.json({ groups: items });
};

export const getOne: RequestHandler = async (req, res) => {
    const { id, id_event } = req.params;
    const item = await groups.getOne({
        id: parseInt(id),
        id_event: parseInt(id_event),
    });
    if (!item) return res.json({ error: "Ocorreu um erro" });
    res.json({ group: item });
};

export const add: RequestHandler = async (req, res) => {
    const { id_event } = req.params;

    const addSchema = z.object({
        name: z.string(),
    });

    const body = addSchema.safeParse(req.body);

    if (!body.success) return res.json({ error: "Dados inválidos" });

    const newGroup = await groups.add({
        name: body.data.name,
        id_event: parseInt(id_event),
    });

    if (!newGroup) return res.json({ error: "Ocorreu um erro" });

    res.status(201).json({ group: newGroup });
};

export const update: RequestHandler = async (req, res) => {
    const { id, id_event } = req.params;

    const updateSchema = z.object({
        name: z.string().optional(),
    });
    const body = updateSchema.safeParse(req.body);
    if (!body.success) return res.json({ error: "Dados inválidos" });

    const updatedGroup = await groups.update(
        {
            id: parseInt(id),
            id_event: parseInt(id_event),
        },
        body.data
    );

    if (!updatedGroup) return res.json({ error: "Ocorreu um erro" });

    res.json({ group: updatedGroup });
};

export const remove: RequestHandler = async (req, res) => {
    const { id, id_event } = req.params;
    const removedGroup = await groups.remove({
        id: parseInt(id),
        id_event: parseInt(id_event),
    });

    if (!removedGroup) return res.json({ error: "Ocorreu um erro" });
    res.json({ group: removedGroup });
};
