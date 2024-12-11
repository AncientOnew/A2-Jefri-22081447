import { useState } from "react";

function Company({ company, contact, companies, setCompanies }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedCompanyName, setEditedCompanyName] = useState(company.company_name);
  const [editedCompanyAddress, setEditedCompanyAddress] = useState(company.company_address);

  // Function to delete a company
  const deleteCompany = async () => {
    try {
      const response = await fetch(
        `http://localhost/api/companies/${company.company_id}/contacts/${contact.id}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        const newCompanies = companies.filter(
          (comp) => comp.company_id !== company.company_id
        );
        setCompanies(newCompanies);
      } else {
        console.error("Failed to delete company");
      }
    } catch (error) {
      console.error("Error while deleting company:", error);
    }
  };

  // Function to update a company's details
  const editCompany = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost/api/companies/${company.company_id}/contacts/${contact.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            company_name: editedCompanyName,
            company_address: editedCompanyAddress,
          }),
        }
      );

      if (response.ok) {
        const updatedCompany = await response.json();
        const updatedCompanies = companies.map((comp) =>
          comp.company_id === company.company_id ? updatedCompany : comp
        );
        setCompanies(updatedCompanies);
        setIsEditing(false); // Exit edit mode
      } else {
        console.error("Failed to update company");
      }
    } catch (error) {
      console.error("Error while updating company:", error);
    }
  };

  return (
    <tr>
      {isEditing ? (
        <>
          <td>
            <input
              type="text"
              value={editedCompanyName}
              onChange={(e) => setEditedCompanyName(e.target.value)}
            />
          </td>
          <td>
            <input
              type="text"
              value={editedCompanyAddress}
              onChange={(e) => setEditedCompanyAddress(e.target.value)}
            />
          </td>
          <td>
            <button className="button green" onClick={editCompany}>
              Save
            </button>
            <button className="button red" onClick={() => setIsEditing(false)}>
              Cancel
            </button>
          </td>
        </>
      ) : (
        <>
          <td>{company.company_name}</td>
          <td>{company.company_address}</td>
          <td>
            <button className="button red" onClick={deleteCompany}>
              Delete
            </button>
            <button className="button blue" onClick={() => setIsEditing(true)}>
              Edit
            </button>
          </td>
        </>
      )}
    </tr>
  );
}

export default Company;
