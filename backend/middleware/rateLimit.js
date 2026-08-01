import { aj } from "../lib/arcjet.js";

export default async function rateLimit(req, res, next) {
    try {
        const decision = await aj.protect(req, {
            requested: 1,
        });

        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                return res.status(429).json({
                    error: "Rate limited",
                });
            } else if (decision.reason.isBot()) {
                return res.status(403).json({
                    error: "Blocked by bot protection",
                });
            } else {
                return res.status(403).json({
                    error: "Blocked by Arcjet",
                });
            }
        }

        // Check for spoofed bots
        if (
            decision.results.some(
                (result) => result.reason.isBot && result.reason.isBot() && result.reason.isSpoof(),
            )
        ) {
            return res.status(403).json({
                error: "Blocked by bot protection",
            });
        }

        next();
    } catch (error) {
        console.log("Arcjet error", error);
        next();
    }
}
