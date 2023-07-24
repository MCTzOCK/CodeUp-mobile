/**
 * src/pages/flows/[id]/FowViewer.tsx
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
import { add, addSharp } from "ionicons/icons";

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
                        background: "#4422FF",
                        color: "white",
                      },
                      deletable: false,
                    },
                  ]);
                }}
              >
                <IonIcon ios={add} md={addSharp} />
              </IonButton>
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
              const text = prompt("Text eingeben", edge.label as string);

              if (text !== null) {
                setEdges((edges) =>
                  edges.map((n) =>
                    n.id === edge.id ? { ...n, label: text } : n,
                  ),
                );
              }
            }}
            onNodeClick={(e, node) => {
              const text = prompt("Text eingeben", node.data.label);

              if (text) {
                setNodes((nodes) =>
                  nodes.map((n) =>
                    n.id === node.id ? { ...n, data: { label: text } } : n,
                  ),
                );
              }
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
