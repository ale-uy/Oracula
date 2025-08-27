import Welcome from '../components/Welcome';
import ReadingForm from '../components/ReadingForm';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-start pt-16 bg-gradient-to-b from-purple-900 to-black text-white overflow-x-hidden">
      <Welcome />
      <ReadingForm />
    </main>
  );
}
