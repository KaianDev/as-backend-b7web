import { Router } from "express";
import * as auth from "../controllers/auth";
import * as events from "../controllers/events";
import * as groups from "../controllers/groups";
import * as people from "../controllers/people";

const router = Router();

router.post("/login", auth.login);

router.get("/ping", auth.validate, (req, res) =>
    res.json({ pong: true, admin: true })
);

router.get("/events", auth.validate, events.getAll);
router.get("/events/:id", auth.validate, events.getOne);
router.post("/events", auth.validate, events.add);
router.put("/events/:id", auth.validate, events.update);
router.delete("/events/:id", auth.validate, events.remove);

router.get("/events/:id_event/groups", auth.validate, groups.getAll);
router.get("/events/:id_event/groups/:id", auth.validate, groups.getOne);
router.post("/events/:id_event/groups", auth.validate, groups.add);
router.put("/events/:id_event/groups/:id", auth.validate, groups.update);
router.delete("/events/:id_event/groups/:id", auth.validate, groups.remove);

router.get(
    "/events/:id_event/groups/:id_group/people",
    auth.validate,
    people.getAll
);
router.get(
    "/events/:id_event/groups/:id_group/people/:id",
    auth.validate,
    people.getOne
);
router.post(
    "/events/:id_event/groups/:id_group/people",
    auth.validate,
    people.add
);
router.put(
    "/events/:id_event/groups/:id_group/people/:id",
    auth.validate,
    people.update
);
router.delete(
    "/events/:id_event/groups/:id_group/people/:id",
    auth.validate,
    people.remove
);

export default router;
