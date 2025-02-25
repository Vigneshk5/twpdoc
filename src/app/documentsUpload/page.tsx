import DocumentUpload from "./DocumentUpload";
import { NavBar } from "./NavBar";

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar />
      <DocumentUpload />
    </div>
  );
}
