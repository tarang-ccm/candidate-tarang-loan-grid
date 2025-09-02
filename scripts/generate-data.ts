import fs from "fs";
import type { Loan } from "../src/types/Loan";

function createLoan(id: number): Loan {
  const statuses = ["Pending", "Approved", "Rejected"];
  const names = [
    "Alice Johnson",
    "Bob Smith",
    "Charlie Brown",
    "Diana Prince",
    "Ethan Hunt",
    "Fiona Gallagher",
    "George Clooney",
    "Hannah Baker",
    "Ian Somerhalder",
    "Julia Roberts",
    "Kevin Hart",
    "Laura Palmer",
    "Mike Ross",
    "Nina Dobrev",
    "Oscar Wilde",
    "Paula Abdul",
    "Quinn Fabray",
    "Rachel Green",
    "Sam Winchester",
    "Tina Fey",
  ];

  const status = statuses[id % statuses.length];
  const borrowerName = names[id % names.length];
  const amount = 1000 + (id % 10000);
  const closeDate = `2025-07-${((id % 28) + 1).toString().padStart(2, "0")}`;

  return { id, borrowerName, amount, status, closeDate };
}

function generateLoans(count: number): Loan[] {
  const loans: Loan[] = [];
  for (let i = 1; i <= count; i++) {
    loans.push(createLoan(i));
  }
  return loans;
}

function saveToFile(filePath: string, data: any) {
  const fullPath = "./data";
  fs.mkdirSync(fullPath, { recursive: true });
  fs.writeFileSync("./" + filePath, JSON.stringify(data, null, 2), "utf-8");
}

const smallSample = generateLoans(100);
saveToFile("data/loans_100.json", smallSample);

const fullData = generateLoans(50000);
saveToFile("data/loans.json", fullData);
