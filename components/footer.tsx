export default function Footer() {
  return (
    <footer className="bg-muted border-t p-4 text-center text-sm text-muted-foreground hidden">
      © {new Date().getFullYear()} SmartPOS. All rights reserved.
    </footer>
  );
}
