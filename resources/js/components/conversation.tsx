import StreamingIndicator from '@/components/streaming-indicator';
import { cn } from '@/lib/utils';
import { useEffect, useRef } from 'react';
import { MemoizedMarkdown } from './memoized-markdown';

type Message = {
    id?: number;
    type: 'response' | 'error' | 'prompt';
    content: string;
    saved?: boolean;
};

interface ConversationProps {
    messages: Message[];
    streamingData?: string;
    isStreaming: boolean;
    streamId?: string;
}

export default function Conversation({ messages, streamingData, isStreaming, streamId }: ConversationProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when messages change or during streaming
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages.length, streamingData]);

    return (
        <div ref={scrollRef} className="flex-1 overflow-x-hidden overflow-y-auto">
            <div className="mx-auto max-w-3xl space-y-4 p-4">
                {messages.length === 0 && <p className="text-muted-foreground mt-8 text-center">Type your message below and hit enter to send.</p>}
                {messages.map((message, index) => {
                    // Create a unique key that won't conflict between saved and new messages
                    const key = message.id ? `db-${message.id}` : `local-${index}-${message.content.substring(0, 10)}`;

                    return (
                        <div key={key} className={cn('relative', message.type === 'prompt' && 'flex justify-end')}>
                            <div
                                className={cn(
                                    'inline-block max-w-[80%] rounded-lg p-3',
                                    message.type === 'prompt' ? 'bg-primary text-primary-foreground' : 'bg-muted',
                                )}
                            >
                                {message.type === 'prompt' && (index === messages.length - 1 || index === messages.length - 2) && streamId && (
                                    <StreamingIndicator id={streamId} className="absolute top-3 -left-8" />
                                )}
                                <div className={cn("prose whitespace-pre-wrap", message.type === 'response' ? "dark:prose-invert" : "not-dark:prose-invert")}>
                                    <MemoizedMarkdown id={key} content={message.content} />
                                </div>
                            </div>
                        </div>
                    );
                })}
                {streamingData && (
                    <div className="relative">
                        <div className="bg-muted inline-block max-w-[80%] rounded-lg p-3">
                            <div className="prose dark:prose-invert whitespace-pre-wrap">
                                <MemoizedMarkdown id={`streaming-${streamId}`} content={streamingData} />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
