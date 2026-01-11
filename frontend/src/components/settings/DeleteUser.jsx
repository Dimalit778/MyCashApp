import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useLogoutMutation } from 'services/api/authApi';
import { useDeleteUserMutation } from 'services/api/userApi';
import './DeleteUser.css';
export default function DeleteUser() {
  const [logout] = useLogoutMutation();
  const [deleteUser] = useDeleteUserMutation();
  const navigate = useNavigate();

  const deleteAlert = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'All your data will be permanently deleted. This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      theme: 'dark',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, Delete My Account',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete();
      }
    });
  };

  const handleDelete = async () => {
    try {
      await deleteUser();
      await logout();
      Swal.fire({
        title: 'Deleted!',
        text: 'Your account has been deleted.',
        icon: 'success',
        showConfirmButton: false,
        timer: 2000,
      });
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (e) {
      console.log(e.message);
    }
  };

  return (
    <div data-cy="deleteUser-container" className="delete-user-container">
      <div className="delete-user-icon">⚠️</div>
      <p className="delete-user-warning">
        Once you delete your account, there is no going back. All your data including transactions, categories, and
        personal information will be permanently deleted.
      </p>
      <button data-cy="delete-account-btn" className="delete-user-button" onClick={deleteAlert}>
        Delete Account
      </button>
    </div>
  );
}
