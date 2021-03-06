import { DataTypes, Model } from 'sequelize';
import DB from '@database';

import { Flow } from '@vo';

interface NodeAttributes {
  id: number;
  flow_id: number;
  name: string; // 节点名
  x: number;
  y: number;
  type: number;
  createdAt: Date;
  updatedAt: Date;
}

class Node extends Model implements NodeAttributes {
  public id!: number;
  public flow_id!: number;
  public name!: string;
  public x!: number;
  public y!: number;
  public type!: number; // 1. 开始节点; 2. 普通节点; 3. 结束节点
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}
Node.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      comment: '自增字段（主键）'
    },
    flow_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      references: {
        model: Flow,
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      comment: 'Flow表外键'
    },
    name: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        notNull: {
          msg: '节点名不能为空'
        },
        notEmpty: {
          msg: '节点名不能为空'
        },
        len: {
          args: [2, 10],
          msg: '节点名长度应为2至10字符'
        }
      },
      comment: '节点名'
    },
    x: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'x不能为空'
        },
        notEmpty: {
          msg: 'x不能为空'
        }
      }
    },
    y: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'y不能为空'
        },
        notEmpty: {
          msg: 'y不能为空'
        }
      }
    },
    type: {
      type: DataTypes.INTEGER.UNSIGNED,
      validate: {
        min: 1,
        max: 3
      }
    }
  },
  {
    sequelize: DB
  }
);

export default Node;
