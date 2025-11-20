import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm CyberPulse Assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = () => {
    if (inputMessage.trim() === "") return;

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);

    // Simulate bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: messages.length + 2,
        text: getBotResponse(inputMessage),
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 1000);

    setInputMessage("");
  };

  const getBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();

    if (input.includes("report") || input.includes("crime") || input.includes("cybercrime")) {
      return "To report a cybercrime, please visit our Report Crime page. You can also call the helpline at 1930 for immediate assistance.";
    } else if (input.includes("misinformation") || input.includes("fake") || input.includes("verify")) {
      return "You can verify suspicious content using our Check Misinformation feature. Simply upload the content or provide a URL, and our AI will analyze it.";
    } else if (input.includes("help") || input.includes("support")) {
      return "I can help you with:\n- Reporting cybercrimes\n- Verifying misinformation\n- Understanding cyber safety\n- Legal information about cyber laws\n\nWhat would you like to know more about?";
    } else if (input.includes("contact") || input.includes("emergency")) {
      return "For emergencies, call the Cyber Crime Helpline: 1930\n\nYou can also file a report directly through our platform 24/7.";
    } else if (input.includes("awareness") || input.includes("learn") || input.includes("safety")) {
      return "Visit our Awareness page to learn about cyber safety practices, how to spot misinformation, and your legal rights as a victim.";
    } else {
      return "I'm here to help you with cybercrime reporting, misinformation verification, and cyber safety information. Could you please provide more details about what you need help with?";
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-16 sm:bottom-20 md:bottom-24 left-4 sm:left-6 md:left-8 w-[calc(100vw-2rem)] sm:w-96 max-w-[400px] h-[400px] sm:h-[450px] md:h-[500px] bg-whiz-dark border-2 border-whiz-primary/50 rounded-2xl shadow-2xl z-50 flex flex-col animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="flex items-center justify-between p-3 sm:p-4 border-b border-whiz-primary/30 bg-whiz-primary/10">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-whiz-primary rounded-full flex items-center justify-center">
                <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 text-whiz-dark" />
              </div>
              <div>
                <h3 className="font-bold text-whiz-light text-sm sm:text-base">CyberPulse Assistant</h3>
                <p className="text-[10px] sm:text-xs text-green-400">● Online</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="hover:bg-whiz-primary/20 h-8 w-8 sm:h-10 sm:w-10"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5 text-whiz-light" />
            </Button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-3 sm:p-4">
            <div className="space-y-3 sm:space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[80%] p-2 sm:p-3 rounded-2xl ${
                      message.sender === "user"
                        ? "bg-whiz-primary text-whiz-dark"
                        : "bg-whiz-secondary/20 text-whiz-light border border-whiz-secondary/30"
                    }`}
                  >
                    <p className="text-xs sm:text-sm whitespace-pre-line">{message.text}</p>
                    <p className="text-[10px] sm:text-xs mt-1 opacity-70">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-3 sm:p-4 border-t border-whiz-primary/30 bg-whiz-dark/80">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Type your message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 bg-whiz-secondary/20 border-whiz-secondary/30 text-whiz-light placeholder:text-muted-foreground focus:border-whiz-primary text-xs sm:text-sm h-9 sm:h-10"
              />
              <Button
                onClick={handleSendMessage}
                size="icon"
                className="bg-whiz-primary hover:bg-whiz-primary/90 text-whiz-dark h-9 w-9 sm:h-10 sm:w-10"
              >
                <Send className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 md:bottom-8 md:left-8 bg-whiz-primary hover:bg-whiz-primary/90 text-whiz-dark rounded-full p-3 sm:p-4 shadow-lg hover:shadow-xl transition-all duration-300 z-50 group"
        aria-label="Open chat"
      >
        {isOpen ? (
          <X className="h-5 w-5 sm:h-6 sm:w-6 group-hover:rotate-90 transition-transform duration-300" />
        ) : (
          <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 group-hover:scale-110 transition-transform duration-300" />
        )}
      </button>
    </>
  );
};

export default ChatBot;
