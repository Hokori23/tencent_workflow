import { DataTypes, Model } from 'sequelize';
import DB from '@database';

interface FlowAttributes {
  id: number;
  text: string; // 流程名
  createdAt: Date;
  updatedAt: Date;
}

class Flow extends Model implements FlowAttributes {
  public id!: number;
  public text!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}
Flow.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      comment: '自增字段（主键）'
    },
    text: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        notNull: {
          msg: '流程名不能为空'
        },
        notEmpty: {
          msg: '流程名不能为空'
        },
        len: {
          args: [1, 10],
          msg: '流程名长度应为1至10字符'
        }
      },
      comment: '流程名'
    }
  },
  {
    sequelize: DB
  }
);

export default Flow;
