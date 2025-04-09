export default function Footer() {
  return (
    <footer className="py-8 mt-12">
      <div className="container mx-auto px-4 text-center">
        <p className="text-inherit text-sm">
          © {new Date().getFullYear()} Powered By Expense Goose
        </p>
        <div className="mt-2">
          <a href="/terms-of-service" className="text-gray-500 hover:underline mx-2">
            Terms of Service
          </a>
          <a href="/privacy-policy" className="text-gray-500 hover:underline mx-2">
            Privacy Policy
          </a>
          <a href="/refund-policy" className="text-gray-500 hover:underline mx-2">
            Refund Policy
          </a>
        </div>
      </div>
    </footer>
  );
}