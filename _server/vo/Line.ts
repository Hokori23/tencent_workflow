import { DataTypes, Model } from 'sequelize';
import DB from '@database';

interface LineAttributes {
  id: number;
  text: string; // 节点名
  start_id: number;
  end_id: number;
  start_anchor: number;
  end_anchor: number;
  type: number;
  style: string;
  createdAt: Date;
  updatedAt: Date;
}

class Line extends Model implements LineAttributes {
  public id!: number;
  public text!: string;
  public start_id!: number;
  public end_id!: number;
  public start_anchor!: number;
  public end_anchor!: number;
  /**
   * 1: 默认连线样式, 动态锚点;
   * 2: 自定义直线样式, 固定锚点;
   * 3: 贝塞尔曲线, 固定锚点;
   */
  public type!: number;
  public style!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}
Line.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      comment: '自增字段（主键）'
    },
    text: {
      type: DataTypes.STRING(20),
      comment: '条件文字'
    },
    start_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      comment: 'Node表外键'
    },
    end_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      comment: 'Node表外键'
    },
    start_anchor: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      comment: 'Node表外键',
      validate: {
        min: 1,
        max: 4
      }
    },
    end_anchor: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      comment: 'Node表外键',
      validate: {
        min: 1,
        max: 4
      }
    },
    type: {
      type: DataTypes.INTEGER.UNSIGNED,
      validate: {
        min: 1,
        max: 3
      }
    },
    style: {
      type: DataTypes.TEXT,
      defaultValue: '{}'
    }
  },
  {
    sequelize: DB
  }
);

export default Line;
