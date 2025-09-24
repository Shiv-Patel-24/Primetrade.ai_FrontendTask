import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, updatePassword } from "../services/authService";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../services/taskService";
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
} from "../services/noteService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DashboardPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // State for Modals
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  // State for Data
  const [tasks, setTasks] = useState([]);
  const [notes, setNotes] = useState([]);
  const [currentTask, setCurrentTask] = useState(null);
  const [currentNote, setCurrentNote] = useState(null);

  // State for Forms
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteContent, setNewNoteContent] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [userRes, tasksRes, notesRes] = await Promise.all([
          getCurrentUser(),
          getTasks(),
          getNotes(),
        ]);
        setUser(userRes.data);
        setTasks(tasksRes.data);
        setNotes(notesRes.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          handleLogout();
        } else {
          toast.error("Could not load dashboard data.");
        }
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword.length < 6) {
      return toast.error("New password must be at least 6 characters long.");
    }
    try {
      const { data } = await updatePassword(passwordData);
      toast.success(data.msg || "Password updated successfully!");
      closePasswordModal();
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to update password.");
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    try {
      const { data } = await createTask({ title: newTaskTitle });
      setTasks([data, ...tasks]);
      setNewTaskTitle("");
      toast.success("Task created successfully!");
    } catch (error) {
      toast.error("Failed to create task.");
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(taskId);
        setTasks(tasks.filter((task) => task._id !== taskId));
        toast.info("Task deleted.");
      } catch (error) {
        toast.error("Failed to delete task.");
      }
    }
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    if (!currentTask || !currentTask.title.trim()) return;
    try {
      const { data } = await updateTask(currentTask._id, {
        title: currentTask.title,
      });
      setTasks(
        tasks.map((task) => (task._id === currentTask._id ? data : task))
      );
      closeTaskModal();
      toast.success("Task updated successfully!");
    } catch (error) {
      toast.error("Failed to update task.");
    }
  };

  const handleCreateNote = async (e) => {
    e.preventDefault();
    if (!newNoteTitle.trim() || !newNoteContent.trim()) return;
    try {
      const { data } = await createNote({
        title: newNoteTitle,
        content: newNoteContent,
      });
      setNotes([data, ...notes]);
      setNewNoteTitle("");
      setNewNoteContent("");
      toast.success("Note created successfully!");
    } catch (error) {
      toast.error("Failed to create note.");
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      try {
        await deleteNote(noteId);
        setNotes(notes.filter((note) => note._id !== noteId));
        toast.info("Note deleted.");
      } catch (error) {
        toast.error("Failed to delete note.");
      }
    }
  };

  const handleUpdateNote = async (e) => {
    e.preventDefault();
    if (
      !currentNote ||
      !currentNote.title.trim() ||
      !currentNote.content.trim()
    )
      return;
    try {
      const { data } = await updateNote(currentNote._id, {
        title: currentNote.title,
        content: currentNote.content,
      });
      setNotes(
        notes.map((note) => (note._id === currentNote._id ? data : note))
      );
      closeNoteModal();
      toast.success("Note updated successfully!");
    } catch (error) {
      toast.error("Failed to update note.");
    }
  };

  const openTaskModal = (task) => {
    setCurrentTask(task);
    setIsTaskModalOpen(true);
  };
  const closeTaskModal = () => {
    setIsTaskModalOpen(false);
    setCurrentTask(null);
  };
  const openNoteModal = (note) => {
    setCurrentNote(note);
    setIsNoteModalOpen(true);
  };
  const closeNoteModal = () => {
    setIsNoteModalOpen(false);
    setCurrentNote(null);
  };
  const openPasswordModal = () => setIsPasswordModalOpen(true);
  const closePasswordModal = () => {
    setIsPasswordModalOpen(false);
    setPasswordData({ oldPassword: "", newPassword: "" });
  };
  const getInitials = (name) => {
    if (!name) return "";
    const names = name.split(" ");
    const initials = names.map((n) => n[0]).join("");
    return initials.toUpperCase();
  };

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        Loading...
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-slate-100">
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
        />
        <nav className="bg-white shadow-sm sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <h1 className="text-2xl font-bold text-blue-600 flex items-center">
                Dashboard
              </h1>
              <div className="flex items-center">
                {user && (
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      {getInitials(user.name)}
                    </button>
                    {isDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50">
                        <div className="px-4 py-2 border-b">
                          <p className="text-sm font-semibold text-gray-800">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            openPasswordModal();
                            setIsDropdownOpen(false);
                          }}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Change Password
                        </a>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-800">Tasks</h2>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-gray-800">
                Add a New Task
              </h3>
              <form onSubmit={handleCreateTask}>
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="What do you need to do?"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="mt-4 w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Add Task
                </button>
              </form>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <input
                type="text"
                placeholder="Search tasks..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="space-y-4">
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <div
                    key={task._id}
                    className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center"
                  >
                    <span className="font-medium text-gray-800">
                      {task.title}
                    </span>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => openTaskModal(task)}
                        className="text-blue-500 hover:text-blue-700 font-semibold"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task._id)}
                        className="text-red-500 hover:text-red-700 font-semibold"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-10 bg-white rounded-lg shadow-md">
                  <p>No tasks found.</p>
                </div>
              )}
            </div>
          </section>

          <section className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-800">Notes</h2>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-4">Add a New Note</h3>
              <form onSubmit={handleCreateNote} className="space-y-4">
                <input
                  type="text"
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                  placeholder="Note title"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <textarea
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  placeholder="Note content..."
                  className="w-full p-3 border border-gray-300 rounded-lg h-24 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white p-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  Add Note
                </button>
              </form>
            </div>
            <div className="space-y-4">
              {notes.length > 0 ? (
                notes.map((note) => (
                  <div
                    key={note._id}
                    className="bg-white p-4 rounded-lg shadow-md"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-bold text-gray-800">{note.title}</h4>
                      <div className="space-x-3">
                        <button
                          onClick={() => openNoteModal(note)}
                          className="text-blue-500 font-semibold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteNote(note._id)}
                          className="text-red-500 font-semibold"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-600 whitespace-pre-wrap">
                      {note.content}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-10 bg-white rounded-lg shadow-md">
                  <p>No notes found.</p>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>

      {isTaskModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md mx-4">
            <h2 className="text-2xl font-bold mb-4">Edit Task</h2>
            <form onSubmit={handleUpdateTask}>
              <input
                type="text"
                value={currentTask?.title || ""}
                onChange={(e) =>
                  setCurrentTask({ ...currentTask, title: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={closeTaskModal}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isNoteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md mx-4">
            <h2 className="text-2xl font-bold mb-4">Edit Note</h2>
            <form onSubmit={handleUpdateNote} className="space-y-4">
              <input
                type="text"
                value={currentNote?.title || ""}
                onChange={(e) =>
                  setCurrentNote({ ...currentNote, title: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <textarea
                value={currentNote?.content || ""}
                onChange={(e) =>
                  setCurrentNote({ ...currentNote, content: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg h-24 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <div className="flex justify-end space-x-4 mt-2">
                <button
                  type="button"
                  onClick={closeNoteModal}
                  className="px-4 py-2 bg-gray-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isPasswordModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md mx-4">
            <h2 className="text-2xl font-bold mb-4">Change Password</h2>
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <input
                type="password"
                placeholder="Old Password"
                value={passwordData.oldPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    oldPassword: e.target.value,
                  })
                }
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
              <input
                type="password"
                placeholder="New Password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value,
                  })
                }
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
              <div className="flex justify-end space-x-4 mt-2">
                <button
                  type="button"
                  onClick={closePasswordModal}
                  className="px-4 py-2 bg-gray-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardPage;
