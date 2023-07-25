/**
 * src/pages/flows/[id]/FlowViewer.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 24.07.23
 *
 */
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonMenuButton,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import * as React from "react";
import { useLoggedIn } from "../../../hooks/useLoggedIn";
import { useCallback, useEffect } from "react";
import ReactFlow, {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Connection,
  Controls,
  Edge,
  EdgeChange,
  MarkerType,
  MiniMap,
  Node,
  NodeChange,
  ReactFlowInstance,
} from "reactflow";
import { useParams } from "react-router";
import "reactflow/dist/style.css";
import REST from "@codeupspace/rest/dist";
import {
  add,
  addSharp,
  colorFill,
  colorFillSharp,
  colorWand,
  colorWandSharp,
  sparkles,
  sparklesSharp,
  swapHorizontal,
  swapHorizontalSharp,
  text,
  textSharp,
  trash,
  trashSharp,
} from "ionicons/icons";

export default function FlowViewer() {
  const { id } = useParams<{ id: string }>();
  const { userInfo, loggedIn, loaded } = useLoggedIn();

  const router = useIonRouter();

  useEffect(() => {
    if (!loggedIn && loaded) {
      router.push("/page/account/login", "none", "replace");
    } else {
    }
  }, [userInfo, loggedIn, loaded]);

  const [nodes, setNodes] = React.useState<Node[]>([]);
  const [edges, setEdges] = React.useState<Edge[]>([]);
  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes],
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges],
  );
  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges],
  );

  const [currentEdge, setCurrentEdge] = React.useState<Edge | null>(null);
  const [currentNode, setCurrentNode] = React.useState<Node | null>(null);

  const [lastEdgeId, setLastEdgeId] = React.useState<string>("");
  const [lastNodeId, setLastNodeId] = React.useState<string>("");

  const [rfInstance, setRfInstance] = React.useState<ReactFlowInstance | null>(
    null,
  );

  useEffect(() => {
    setLastEdgeId("__rendered_" + currentEdge?.id ?? "");
  }, [currentEdge]);

  useEffect(() => {
    setLastNodeId("__rendered_" + currentNode?.id ?? "");
  }, [currentNode]);

  useEffect(() => {
    if (rfInstance) {
      const saved = rfInstance.toObject();

      REST.ToDo.updateV2Project({
        token: localStorage.getItem("token") as string,
        id: id as string,
        saved: JSON.stringify(saved),
      });
    }
  }, [edges, nodes]);

  useEffect(() => {
    const savedNodes: Node[] = [];
    const savedEdges: Edge[] = [];

    REST.ToDo.getV2Project({
      token: localStorage.getItem("token") as string,
      id: id as string,
    }).then((res) => {
      if (res.status === 200) {
        let p = res.payload.projects[0];
        if (!p.saved || p.saved === "") {
          savedNodes.push({
            id: `1`,
            data: { label: "Hauptknoten" },
            position: {
              x: 100,
              y: 100,
            },
            style: {
              background: "#4422FF",
              color: "white",
            },
            deletable: false,
          });
        } else {
          const saved = JSON.parse(p.saved);
          savedNodes.push(...saved.nodes);
          savedEdges.push(...saved.edges);
        }

        setNodes(savedNodes);
        setEdges(savedEdges);
      } else {
        alert("Fehler beim Laden des Projekts");
      }
    });
  }, [id]);

  return (
    <>
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonTitle>Flow</IonTitle>
            <IonButtons slot={"end"}>
              <IonButton
                onClick={() => {
                  const randomNumber = (min: number, max: number) => {
                    return Math.floor(Math.random() * (max - min + 1)) + min;
                  };

                  setNodes((nodes) => [
                    ...nodes,
                    {
                      id: `${nodes.length + 1}`,
                      data: { label: "Neuer Knoten" },
                      position: {
                        x: randomNumber(0, 400),
                        y: randomNumber(0, 400),
                      },
                      style: {
                        background: "#4422AA",
                        color: "white",
                      },
                      deletable: false,
                    },
                  ]);
                }}
              >
                <IonIcon ios={add} md={addSharp} />
              </IonButton>
              {currentNode && (
                <>
                  <IonButton
                    onClick={() => {
                      setNodes((nodes) =>
                        nodes.filter((n) => n.id !== currentNode.id),
                      );
                      setEdges((edges) =>
                        edges.filter(
                          (e) =>
                            e.source !== currentNode.id &&
                            e.target !== currentNode.id,
                        ),
                      );
                      setCurrentNode(null);
                    }}
                  >
                    <IonIcon ios={trash} md={trashSharp} />
                  </IonButton>
                  <IonButton
                    onClick={() => {
                      (
                        document.querySelector(
                          "#flows-i-color",
                        ) as HTMLIonSelectElement
                      ).click();
                    }}
                  >
                    <IonIcon ios={colorFill} md={colorFillSharp} />
                  </IonButton>
                  <IonButton
                    onClick={() => {
                      const text = prompt(
                        "Text",
                        currentNode?.data.label ?? "",
                      );
                      if (text) {
                        setNodes((nodes) =>
                          nodes.map((n) =>
                            n.id === currentNode.id
                              ? {
                                  ...n,
                                  data: {
                                    ...n.data,
                                    label: text,
                                  },
                                }
                              : n,
                          ),
                        );
                        setCurrentNode(null);
                      }
                    }}
                  >
                    <IonIcon ios={text} md={textSharp} />
                  </IonButton>
                  <IonSelect
                    id={"flows-i-color"}
                    style={{
                      display: "none",
                    }}
                    onIonChange={(e) => {
                      setNodes((nodes) =>
                        nodes.map((n) =>
                          n.id === currentNode.id
                            ? {
                                ...n,
                                style: {
                                  ...n.style,
                                  background: e.detail.value,
                                },
                              }
                            : n,
                        ),
                      );
                      setCurrentNode(null);
                    }}
                  >
                    <IonSelectOption value="#4422AA">Blau</IonSelectOption>
                    <IonSelectOption value="#44AA22">Grün</IonSelectOption>
                    <IonSelectOption value="#AA4422">Rot</IonSelectOption>
                    <IonSelectOption value="#000000">Schwarz</IonSelectOption>
                  </IonSelect>
                </>
              )}
              {currentEdge && (
                <>
                  <IonButton
                    onClick={() => {
                      setEdges((edges) =>
                        edges.filter((e) => e.id !== currentEdge.id),
                      );
                      setCurrentEdge(null);
                    }}
                  >
                    <IonIcon ios={trash} md={trashSharp} />
                  </IonButton>
                  <IonButton
                    onClick={() => {
                      setEdges((edges) =>
                        edges.map((e) =>
                          e.id === currentEdge.id
                            ? {
                                ...e,
                                animated: !e.animated,
                              }
                            : e,
                        ),
                      );
                      setCurrentEdge(null);
                    }}
                  >
                    <IonIcon ios={sparkles} md={sparklesSharp} />
                  </IonButton>
                  <IonButton
                    onClick={() => {
                      setEdges((edges) =>
                        edges.map((e) =>
                          e.id === currentEdge.id
                            ? {
                                ...e,
                                type:
                                  e.type === "default"
                                    ? "smoothstep"
                                    : "default",
                              }
                            : e,
                        ),
                      );
                      setCurrentEdge(null);
                    }}
                  >
                    <IonIcon ios={swapHorizontal} md={swapHorizontalSharp} />
                  </IonButton>

                  <IonButton
                    onClick={() => {
                      const text = prompt(
                        "Text",
                        (currentEdge?.label as string) ?? "",
                      );
                      if (text !== null) {
                        setEdges((edges) =>
                          edges.map((n) =>
                            n.id === currentEdge.id
                              ? {
                                  ...n,
                                  label: text,
                                }
                              : n,
                          ),
                        );
                        setCurrentEdge(null);
                      }
                    }}
                  >
                    <IonIcon ios={text} md={textSharp} />
                  </IonButton>
                </>
              )}
            </IonButtons>
          </IonToolbar>
        </IonHeader>

        <IonContent fullscreen>
          <IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle size="large">Flow</IonTitle>
            </IonToolbar>
          </IonHeader>

          <ReactFlow
            nodes={nodes}
            edges={edges}
            onConnect={onConnect}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            snapToGrid={true}
            zoomOnPinch
            snapGrid={[10, 10]}
            onInit={setRfInstance}
            onEdgeClick={(e, edge) => {
              setCurrentEdge(edge);
              setCurrentNode(null);
            }}
            onNodeClick={(e, node) => {
              setCurrentNode(node);
              setCurrentEdge(null);
            }}
          >
            <Background />
            <Controls />
          </ReactFlow>
        </IonContent>
      </IonPage>
    </>
  );
}
