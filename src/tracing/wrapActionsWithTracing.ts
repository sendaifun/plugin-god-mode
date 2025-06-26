
import * as Sentry from '@sentry/node';
import type { Action } from 'solana-agent-kit';

export function wrapActionsWithTracing(actions: Action[], opPrefix: string): Action[] {
    return actions.map((action) => {
        const originalHandler = action.handler;

        const wrappedHandler: Action["handler"] = async (agent, input) => {
            return await Sentry.startSpan(
                { name: action.name, op: `${opPrefix}.${action.name}` },
                async (span) => {
                    try {
                        return await originalHandler(agent, input);
                    } catch (err) {
                        Sentry.captureException(err, {
                            tags: { module: 'godmode', action: action.name },
                            extra: { input },
                        });
                        span?.setStatus({
                            code: 2,
                            message: err instanceof Error ? err.message : String(err),
                        });
                        throw err;
                    } finally {
                        span?.end();
                    }
                }
            );
        };

        return {
            ...action,
            handler: wrappedHandler,
        };
    });
}
