/**
 * AnnouncementBar.jsx
 * Scrolling ticker strip at the very top of every page.
 * Mirrors the "SAVE 10% WITH CODE SAVE10 · FREE SHIPPING ON ORDERS OVER $150" bar.
 */

const MESSAGES = [
  "SAVE 10% WITH CODE SAVE10",
  "FREE SHIPPING ON ORDERS OVER $150",
  "SAVE 10% WITH CODE SAVE10",
  "FREE SHIPPING ON ORDERS OVER $150",
  "SAVE 10% WITH CODE SAVE10",
  "FREE SHIPPING ON ORDERS OVER $150",
];

export default function AnnouncementBar() {
  return (
    <div className="bg-garm-black text-garm-white py-2 flex justify-center items-center">
      <span className="label-sm px-8 opacity-90 tracking-widest">
        FREE SHIPPING · SAVE 10% WITH CODE SAVE10
      </span>
    </div>
  );
}
