import './Create.css';

import {
  useEffect,
  useState,
} from 'react';

import { Timestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import CreatableSelect from 'react-select/creatable';

import { useAuthContext } from '../hooks/useAuthContext';
import { useCollection } from '../hooks/useCollection';
import { useFirestore } from '../hooks/useFirestore';

const categories = [
  { value: "development", label: "Development" },
  { value: "design", label: "Design" },
  { value: "sales", label: "Sales" },
  { value: "marketing", label: "Marketing" },
];

function Create() {
  const { documents } = useCollection("users");
  const [users, setUsers] = useState([]);
  const { user } = useAuthContext();
  const { addDocument, response } = useFirestore("projects");

  useEffect(() => {
    if (documents) {
      const options = documents.map((user) => {
        return {
          value: user,
          label: user.displayName,
        };
      });
      setUsers(options);
    }
  }, [documents]);

  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [category, setCategory] = useState("");
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [formError, setFormError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!category) {
      setFormError(`Please select an category`);
      return;
    }

    if (assignedUsers.length < 1) {
      setFormError("Please add any user");
      return;
    }

    const createdBy = {
      displayName: user.displayName,
      id: user.uid,
      photoURL: user.photoURL,
    };

    const assignedUsersList = assignedUsers.map((user) => {
      console.log(user);
      return {
        displayName: user.value.displayName,
        photoURL: user.value.photoURL,
        id: user.value.id,
      };
    });

    const project = {
      name,
      details,
      dueDate: Timestamp.fromDate(new Date(dueDate)),
      category: category.value,
      comments: [],
      createdBy,
      assignedUsersList,
    };

    console.log(project);

    await addDocument(project);

    if (!response.error) {
      navigate("/");
    }
  };

  return (
    <div className="create-form">
      <h2 className="page-title">Create a new project:</h2>
      <form onSubmit={handleSubmit}>
        <label>
          <span>Project name:</span>
          <input
            type="text"
            required
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </label>
        <label>
          <span>Project Details:</span>
          <textarea
            required
            onChange={(e) => setDetails(e.target.value)}
            value={details}
          />
        </label>

        <label>
          <span>Set due date:</span>
          <input
            type="date"
            onChange={(e) => setDueDate(e.target.value)}
            required
            value={dueDate}
          />
        </label>

        <label>
          <span>Project's category:</span>
          <CreatableSelect
            options={categories}
            onChange={(option) => setCategory(option)}
          />
        </label>

        <label>
          <span>Asssign:</span>
          <CreatableSelect
            options={users}
            onChange={(option) => setAssignedUsers(option)}
            isMulti
          />
        </label>

        <button className="btn">Add Project</button>
        {formError && <div className="error">{formError}</div>}
      </form>
    </div>
  );
}

export default Create;
