import ReactTable from "../../../components/ReactTable/ReactTable.js";
import { Button, Card, Container, Row, Col } from "react-bootstrap";
import React, { useEffect,useCallback } from "react";
import { getDocFini } from "../../../Redux/documentReduce";
import { useDispatch } from "react-redux";
import { verification } from "../../../Redux/usersReduce";

// core components
function ListDocument() {
  const dispatch = useDispatch();
  const [entities, setEntities] = React.useState([]);

  //verif token
  const verifToken = useCallback(async () => {
    var response = await dispatch(verification());
    if (response.payload === false) {
      localStorage.clear();
      window.location.replace("/login");
    }
  }, [dispatch]);
  useEffect(() => {
    verifToken();
    const promise = new Promise((resolve, reject) => {
      setTimeout(async () => {
          var response = await dispatch(getDocFini());
          resolve(response.payload);
      }, 0);
    });

    promise.then((value) => {
      setEntities(value);
    });
  }, [dispatch,verifToken])
  return (
    <>
      <Container fluid>
        <Row>
          <Col md="12">
            <h4 className="title">Feuille émargement </h4>
            <Card className="card-header">
              <Card.Body>
                <ReactTable
                  data={entities}
                  columns={[
                    {
                      Header: "Référence",
                      accessor: "reference",
                    },
                    {
                      Header: "Titre",
                      accessor: "documents.titre",
                    },
                    {
                      Header: "actions",
                      accessor: "id_document",
                      Cell: ({ cell }) => (
                        <div className="actions-right block_action">
                          <Button
                            onClick={() => {
                              window.location.replace("/ajouterFeuille/"+cell.row.values.id_document+"/"+cell.row.original.id)
                            }}
                            className="btn-info btn"
                          >
                            <i className="fa fa-print" /> Imprimer
                          </Button>
                        </div>
                      ),
                    },
                  ]} 
                  className="-striped -highlight primary-pagination"
                />
                {entities.length === 0 ? (
                  <div className="text-center">Aucun donnée trouvé</div>
                ) : ""}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default ListDocument;
