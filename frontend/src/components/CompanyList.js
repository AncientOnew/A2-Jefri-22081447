import React, { useState } from "react";
import Company from "./Company";
import { useEffect } from "react";

function CompanyList({ contact, companies, setCompanies }) {
  const [newCompanyName, setNewCompanyName] = useState("");
  const [newCompanyAddress, setNewCompanyAddress] = useState("");

  // Create a new company
  const createNewCompany = async (e) => {
    e.preventDefault();
    if (!newCompanyName || !newCompanyAddress) return;

    try {
      const response = await fetch(
        `http://localhost/api/companies/${contact.id}/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ company_name: newCompanyName, company_address: newCompanyAddress }),
        }
      );

      if (response.ok) {
        const createdCompany = await response.json();
        setCompanies([...companies, createdCompany]);
        setNewCompanyName("");
        setNewCompanyAddress("");
      } else {
        console.error("Failed to create company");
      }
    } catch (error) {
      console.error("Error while creating company:", error);
    }
  };

  return (
    <div className="company-list">
      <form onSubmit={createNewCompany}>
        <input
          type="text"
          value={newCompanyName}
          onChange={(e) => setNewCompanyName(e.target.value)}
          placeholder="Company Name"
        />
        <input
          type="text"
          value={newCompanyAddress}
          onChange={(e) => setNewCompanyAddress(e.target.value)}
          placeholder="Company Address"
        />
        <button className="button green" type="submit">
          Add Company
        </button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Company Name</th>
            <th>Company Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company) => (
            <Company
              key={company.company_id}
              company={company}
              contact={contact}
              companies={companies}
              setCompanies={setCompanies}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CompanyList;
