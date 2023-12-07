import { Prisma, PrismaClient } from "@prisma/client";
import * as events from "./events";

const prisma = new PrismaClient();

export const getAll = async (id_event: number) => {
    try {
        return await prisma.eventGroup.findMany({ where: { id_event } });
    } catch (error) {
        return false;
    }
};

type GetOneFilters = { id: number; id_event?: number };
export const getOne = async (filters: GetOneFilters) => {
    try {
        return await prisma.eventGroup.findFirst({ where: filters });
    } catch (error) {
        return false;
    }
};

type DataAddGroup = Prisma.Args<typeof prisma.eventGroup, "create">["data"];
export const add = async (data: DataAddGroup) => {
    try {
        if (!data.id_event) return false;
        const hasEvent = await events.getOne(data.id_event);
        if (!hasEvent) return false;

        return await prisma.eventGroup.create({ data });
    } catch (error) {
        return false;
    }
};

type UpdateFilters = { id: number; id_event: number };
type DataUpdateGroup = Prisma.Args<typeof prisma.eventGroup, "update">["data"];
export const update = async (filters: UpdateFilters, data: DataUpdateGroup) => {
    try {
        return await prisma.eventGroup.update({ where: filters, data });
    } catch (error) {
        return false;
    }
};
type DeleteFilter = { id: number; id_event: number };
export const remove = async (filters: DeleteFilter) => {
    try {
        return await prisma.eventGroup.delete({ where: filters });
    } catch (error) {
        return false;
    }
};
