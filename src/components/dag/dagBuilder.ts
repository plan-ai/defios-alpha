export function createDAGTree(vertices: any, edges: any) {
  const graph: any = {};
  const vertexCoordinates: any = {};

  const newVertices: any = [];

  vertices.forEach((vertex: any) => {
    newVertices.push(vertex.id);
  });

  newVertices.forEach((vertex: any) => {
    graph[vertex] = [];
  });

  edges.forEach((edge: any) => {
    const { source, target } = edge;
    graph[source].push(target);
  });

  const layers = computeLayers(graph);
  const horizontalSpacing = 240; // Adjust this value for desired horizontal spacing
  const verticalSpacing = 200; // Adjust this value for desired vertical spacing

  let currentX = 0;
  layers.forEach((layer) => {
    const layerSize = layer.length;
    const startY = -((layerSize - 1) * verticalSpacing) / 2;

    layer.forEach((vertex, index) => {
      const y = startY + index * verticalSpacing;
      vertexCoordinates[vertex] = { x: currentX, y };
    });

    currentX += horizontalSpacing;
  });

  const updatedVertices = vertices.map((vertex: any) => {
    return { ...vertex, position: vertexCoordinates[vertex.id] };
  });

  return updatedVertices;
}

function computeLayers(graph: any) {
  const inDegrees = calculateInDegrees(graph);
  const layers = [];
  const queue = [];

  // Find vertices with zero in-degree and add them to the queue
  for (let vertex in inDegrees) {
    if (inDegrees[vertex] === 0) {
      queue.push(vertex);
    }
  }

  // Perform a breadth-first search to determine layers
  while (queue.length > 0) {
    const currentLayer = [];
    const currentLayerSize = queue.length;

    for (let i = 0; i < currentLayerSize; i++) {
      const vertex: any = queue.shift();
      currentLayer.push(vertex);

      // Decrement the in-degree of neighboring vertices
      graph[vertex].forEach((neighbor: any) => {
        inDegrees[neighbor]--;
        if (inDegrees[neighbor] === 0) {
          queue.push(neighbor);
        }
      });
    }

    layers.push(currentLayer);
  }

  return layers;
}

function calculateInDegrees(graph: any) {
  const inDegrees: any = {};

  for (let vertex in graph) {
    inDegrees[vertex] = 0;
  }

  for (let vertex in graph) {
    graph[vertex].forEach((neighbor: any) => {
      inDegrees[neighbor]++;
    });
  }

  return inDegrees;
}
