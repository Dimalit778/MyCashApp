import { format } from "date-fns";
import Capitalize from "utils/Capitalize";

const TableItem = ({
  item,
  selectedItems,
  toggleSelection,
  categoryColors,
  handleOpenModal,
}) => {
  return (
    <tr
      data-cy="transactions-row"
      key={item._id}
      onClick={() => handleOpenModal("edit", item)}
      className="align-middle text-center"
    >
      <td style={{ width: "20%", textAlign: "left" }}>
        {Capitalize(item.description)}
      </td>

      <td>${item.amount.toLocaleString()}</td>
      <td>
        <div className="d-flex justify-content-center">
          <span
            className={`badge bg-${
              categoryColors[item.category] || "secondary"
            }`}
            style={{
              padding: "0.5rem 1rem",
              fontSize: "0.85rem",
              width: "auto",
              minWidth: "90px",
              display: "inline-block",
              textTransform: "capitalize",
              fontWeight: "500",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {item.category}
          </span>
        </div>
      </td>

      <td>{format(new Date(item.date), "MMM dd, yyyy")}</td>
      <td className="text-center" onClick={(e) => e.stopPropagation()}>
        <div className="form-check d-flex justify-content-center">
          <input
            className="form-check-input bg-secondary"
            type="checkbox"
            checked={selectedItems.includes(item._id)}
            onChange={() => toggleSelection(item._id)}
            onClick={(e) => e.stopPropagation()}
            style={{
              cursor: "pointer",
              width: "1.2rem",
              height: "1.2rem",
              borderRadius: "3px",
            }}
          />
        </div>
      </td>
    </tr>
  );
};

export default TableItem;
