"use client";

import { useEffect } from "react";

export default function KommoChat() {
  useEffect(() => {
    // Kommo chat widget - se configura con el script que provee Kommo
    // Reemplazar KOMMO_CHAT_SCRIPT_ID con el ID real de tu widget
    const scriptId = process.env.NEXT_PUBLIC_KOMMO_CHAT_ID;

    if (!scriptId) return;

    const script = document.createElement("script");
    script.async = true;
    script.id = "kommo-chat-widget";
    script.src = `https://www.kommo.com/static/chats/js/amo_chat_widget.js?v=${Date.now()}`;
    script.dataset.chatId = scriptId;
    document.body.appendChild(script);

    return () => {
      const existing = document.getElementById("kommo-chat-widget");
      if (existing) existing.remove();
    };
  }, []);

  return null;
}
