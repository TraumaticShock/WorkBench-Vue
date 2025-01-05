/**
 * 工作时长记录接口定义
 */
export interface WorkDuration {
  /** 唯一标识 */
  id: string;

  /** 关联用户的 ID */
  userId: string;

  /** 工作日期 */
  date: string;

  /** 工作开始时间 */
  startTime: string;

  /** 工作结束时间 */
  endTime: string;

  /** 工作时长（小时） */
  duration: number;

  /** 记录创建时间 */
  createdAt: string;

  /** 记录最后更新时间 */
  updatedAt: string;
}
