import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function initials(name: string) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const formatMatchDate = (dateString: string) => {
  const date = new Date(dateString);

  const dateText = new Intl.DateTimeFormat(
    "pt-BR",
    {
      day: "numeric",
      month: "short",
      weekday: "short",
    }
  ).format(date);

  const timeText = new Intl.DateTimeFormat(
    "pt-BR",
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  ).format(date);

  return {
    date: dateText,
    time: timeText,
  };
};

export function getMatchStatus(status: string) {
  switch (status) {
    case "Scheduled":
      return {
        label: "Agendada",
        className: "text-muted-foreground",
      };

    case "InProgress":
      return {
        label: "Ao vivo",
        className: "text-success",
      };

    case "Finished":
      return {
        label: "Encerrada",
        className: "text-gold",
      };

    case "Cancelled":
      return {
        label: "Cancelada",
        className: "text-destructive",
      };
  }
}

const countryNamesPt: Record<string, string> = {
  // Anfitriões
  Canada: "Canadá",
  "United States": "Estados Unidos",
  Mexico: "México",

  // AFC
  "Saudi Arabia": "Arábia Saudita",
  Australia: "Austrália",
  Qatar: "Catar",
  "South Korea": "Coreia do Sul",
  Iran: "Irã",
  Iraq: "Iraque",
  Japan: "Japão",
  Jordan: "Jordânia",
  Uzbekistan: "Uzbequistão",

  // CAF
  "South Africa": "África do Sul",
  Algeria: "Argélia",
  "Cape Verde Islands": "Cabo Verde",
  "Ivory Coast": "Costa do Marfim",
  Egypt: "Egito",
  Ghana: "Gana",
  Morocco: "Marrocos",
  "DR Congo": "RD do Congo",
  Senegal: "Senegal",
  Tunisia: "Tunísia",

  // CONMEBOL
  Argentina: "Argentina",
  Brazil: "Brasil",
  Colombia: "Colômbia",
  Ecuador: "Equador",
  Paraguay: "Paraguai",
  Uruguay: "Uruguai",

  // OFC
  "New Zealand": "Nova Zelândia",

  // UEFA
  Germany: "Alemanha",
  Austria: "Áustria",
  Belgium: "Bélgica",
  "Bosnia and Herzegovina": "Bósnia e Herzegovina",
  Croatia: "Croácia",
  Scotland: "Escócia",
  Spain: "Espanha",
  France: "França",
  Netherlands: "Holanda",
  England: "Inglaterra",
  Norway: "Noruega",
  Portugal: "Portugal",
  Czechia: "República Tcheca",
  Sweden: "Suécia",
  Switzerland: "Suíça",
  Turkey: "Turquia",

  // Concacaf
  Curaçao: "Curaçau",
  Haiti: "Haiti",
  Panama: "Panamá",
};

export function getCountryNamePt(name: string) {
  return countryNamesPt[name] ?? name;
}