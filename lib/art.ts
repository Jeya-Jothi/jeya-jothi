export const PINTEREST_URL = "https://www.pinterest.com/jeyajothi22/_created/";

export type Artwork = {
  id: string;
  src: string;
  title: string;
  shape: "portrait" | "square" | "wide";
};

export const ART: readonly Artwork[] = [
  { id: "01", src: "/art/01.jpg", title: "Untitled 01", shape: "portrait" },
  { id: "02", src: "/art/02.jpg", title: "Untitled 02", shape: "square" },
  { id: "03", src: "/art/03.jpg", title: "Untitled 03", shape: "wide" },
  { id: "04", src: "/art/04.jpg", title: "Untitled 04", shape: "portrait" },
  { id: "05", src: "/art/05.jpg", title: "Untitled 05", shape: "square" },
  { id: "06", src: "/art/06.jpg", title: "Untitled 06", shape: "portrait" },
  { id: "07", src: "/art/07.jpg", title: "Untitled 07", shape: "wide" },
  { id: "08", src: "/art/08.jpg", title: "Untitled 08", shape: "portrait" },
  { id: "09", src: "/art/09.jpg", title: "Untitled 09", shape: "square" },
  { id: "10", src: "/art/10.jpg", title: "Untitled 10", shape: "portrait" },
];
