import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';

export const useGetCalls = () => {
    const { data: session, status } = useSession();
    const client = useStreamVideoClient();
    const [calls, setCalls] = useState<Call[]>();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const loadCalls = async () => {
            if (!client || status !== 'authenticated') return;

            const userId = session?.user?.id;
            if (!userId) return;

            setIsLoading(true);

            try {
                // https://getstream.io/video/docs/react/guides/querying-calls/#filters
                const { calls } = await client.queryCalls({
                    sort: [{ field: 'starts_at', direction: -1 }],
                    filter_conditions: {
                        starts_at: { $exists: true },
                        $or: [
                            { created_by_user_id: userId },
                            { members: { $in: [userId] } },
                        ],
                    },
                });

                setCalls(calls);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        loadCalls();
    }, [client, session?.user?.id, status]);

    const now = new Date();

    const endedCalls = calls?.filter(({ state: { startsAt, endedAt } }: Call) => {
        return (startsAt && new Date(startsAt) < now) || !!endedAt;
    });

    const upcomingCalls = calls?.filter(({ state: { startsAt } }: Call) => {
        return startsAt && new Date(startsAt) > now;
    });

    return { endedCalls, upcomingCalls, callRecordings: calls, isLoading };
};
