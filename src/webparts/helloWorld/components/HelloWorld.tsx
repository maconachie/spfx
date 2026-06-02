import * as React from "react";
import styles from "./HelloWorld.module.scss";
import type { IHelloWorldProps } from "./IHelloWorldProps";
import { escape } from "@microsoft/sp-lodash-subset";
import {
  CheckboxVisibility,
  DetailsList,
  DetailsListLayoutMode,
  IconButton,
  type IColumn,
  SelectionMode,
} from "@fluentui/react";
import bookData, { type IBookItem } from "./data/bookData";

export default class HelloWorld extends React.Component<IHelloWorldProps> {
  private readonly _deleteBook = (item?: IBookItem): void => {
    if (!item) {
      return;
    }

    const index = bookData.findIndex((book) => book.key === item.key);
    if (index >= 0) {
      bookData.splice(index, 1);
      this.forceUpdate();
    }
  };

  public render(): React.ReactElement<IHelloWorldProps> {
    const { description, environmentMessage, hasTeamsContext } = this.props;

    const columns: IColumn[] = [
      {
        key: "col-title",
        name: "Title",
        fieldName: "title",
        minWidth: 140,
        maxWidth: 260,
        isResizable: true,
      },
      {
        key: "col-author",
        name: "Author",
        fieldName: "author",
        minWidth: 120,
        maxWidth: 220,
        isResizable: true,
      },
      {
        key: "col-genre",
        name: "Genre",
        fieldName: "genre",
        minWidth: 120,
        maxWidth: 180,
        isResizable: true,
      },
      {
        key: "col-available",
        name: "Available",
        fieldName: "available",
        minWidth: 80,
        maxWidth: 110,
        isResizable: true,
      },
      {
        key: "col-icons",
        name: "Actions",
        minWidth: 70,
        maxWidth: 80,
        isResizable: false,
        onRender: (item?: IBookItem) => (
          <IconButton
            iconProps={{ iconName: "Delete" }}
            title="Delete book"
            ariaLabel="Delete book"
            onClick={() => this._deleteBook(item)}
          />
        ),
      },
    ];

    return (
      <section
        className={`${styles.helloWorld} ${hasTeamsContext ? styles.teams : ""}`}
      >
        <div className={styles.welcome}>
          <div>{environmentMessage}</div>
          <div>
            Web part property value: <strong>{escape(description)}</strong>
          </div>
        </div>
        <div className={styles.booksSection}>
          <h3>Library Books</h3>
          <DetailsList
            items={bookData}
            columns={columns}
            setKey="booksList"
            layoutMode={DetailsListLayoutMode.justified}
            selectionMode={SelectionMode.none}
            checkboxVisibility={CheckboxVisibility.hidden}
          />
        </div>
      </section>
    );
  }
}
