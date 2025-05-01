import { Link } from "react-router-dom";

export default function ChallengeCard({ challenge }) {
  const isPast = new Date(`${challenge.date}T${challenge.endTime}`) < new Date();

  return (
    <div className="border p-4 rounded shadow bg-white space-y-2">
      <h3 className="text-xl font-bold">Recipe ID: {challenge.recipeId}</h3>
      <p><strong>Date:</strong> {challenge.date}</p>
      <p><strong>Time:</strong> {challenge.startTime} - {challenge.endTime}</p>
      <p><strong>Status:</strong> {challenge.status}</p>
      <div className="flex justify-between items-center">
        {isPast ? (
          <span className="text-red-500">Challenge Ended</span>
        ) : (
          <Link to={`/challenge/${challenge.id}`} className="bg-blue-500 text-white px-4 py-1 rounded">Start / Resume</Link>
        )}
      </div>
    </div>
  );
}
