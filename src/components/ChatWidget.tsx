import { useState, useRef, useEffect } from "react";

const API_BASE = "http://localhost:8080/chat";

interface Message {
    role: "user" | "assistant";
    text: string;
}

function generateId(): string {
    return crypto.randomUUID();
}

export default function ChatWidget() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: "assistant", text: "Hi there! Can I help you?" }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const conversationId = useRef(generateId());
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    const sendMessage = async () => {
        const trimmed = input.trim();
        if (!trimmed || loading) return;

        setMessages(prev => [...prev, { role: "user", text: trimmed }]);
        setInput("");
        setLoading(true);

        try {
            const params = new URLSearchParams({
                message: trimmed,
                conversationId: conversationId.current,
            });

            const res = await fetch(`${API_BASE}?${params}`);
            if (!res.ok) throw new Error();

            const reply = await res.text();

            setMessages(prev => [
                ...prev,
                { role: "assistant", text: reply }
            ]);
        } catch {
            setMessages(prev => [
                ...prev,
                { role: "assistant", text: "Something went wrong." }
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ position: "fixed", bottom: 20, right: 20 }}>
            {open && (
                <div style={{
                    width: 300,
                    height: 400,
                    border: "1px solid #ccc",
                    background: "white",
                    display: "flex",
                    flexDirection: "column",
                    padding: "10px"
                }}>
                    <strong>AI Assistant</strong>

                    <div style={{ flex: 1, overflowY: "auto", margin: "10px 0" }}>
                        {messages.map((msg, i) => (
                            <div key={i} style={{
                                textAlign: msg.role === "user" ? "right" : "left"
                            }}>
                                <p>{msg.text}</p>
                            </div>
                        ))}
                        <div ref={bottomRef} />
                    </div>

                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        placeholder="Type a message..."
                    />

                    <button onClick={sendMessage} disabled={loading}>
                        Send
                    </button>
                </div>
            )}

            <button onClick={() => setOpen(!open)}>
                💬
            </button>
        </div>
    );
}