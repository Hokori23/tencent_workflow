import Flow from './Flow';
import Node from './Node';
import Line from './Line';

// Flow : Node = 1 : N
Flow.hasMany(Node, {
  foreignKey: 'flow_id'
});
Node.belongsTo(Flow, {
  foreignKey: 'flow_id',
  onDelete: 'CASCADE'
});

// Node : Line = N : M
Line.belongsToMany(Node, {
  through: 'Node__Line_start_id',
  targetKey: 'id',
  sourceKey: 'start_id',
  constraints: false,
  onDelete: 'CASCADE'
});
Line.belongsToMany(Node, {
  through: 'Node__Line_end_id',
  targetKey: 'id',
  sourceKey: 'end_id',
  constraints: false,
  onDelete: 'CASCADE'
});

export { Flow, Node, Line };
export default { Flow, Node, Line };
