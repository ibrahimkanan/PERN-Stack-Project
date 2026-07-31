import { aj } from "@arcjet/node";

export default async function rateLimit(req, res, next) {
    try {
        const decision = await aj.protect(req, {
            request: 1,
        });

        if (decision.isDenied()) {
            if (decision.isRateLimited()) {
                return res.status(429).json({
                    error: "Rate limited",
                });
            } else if (decision.isBot()) {
                return res.status(403).json({
                    error: "Blocked by bot protection",
                });
            } else {
                return res.status(403).json({
                    error: "Blocked by Arcjet",
                });
            }

            return;
        }

        // Check for spoofed bots
        if (
            decision.results.some(
                (result) => result.isBot() && result.reason.isSpoof(),
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
