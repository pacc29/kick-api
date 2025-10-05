import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { DataSource } from 'typeorm';
import { state } from '../enums/state.enum';

@ValidatorConstraint({ async: true })
export class NotExistsConstraint implements ValidatorConstraintInterface {
  constructor(private readonly dataSource: DataSource) {}

  async validate(value: any, args: ValidationArguments): Promise<boolean> {
    const [entityClass, column, notLikeState] = args.constraints;

    const repo = this.dataSource.getRepository(entityClass);

    const recordExists = repo
      .createQueryBuilder()
      .where(`${column} = :value`, { value });

    if (notLikeState !== null) {
      recordExists.andWhere('state != :state', { state: notLikeState });
    }

    return !(await recordExists.getExists());
  }

  defaultMessage(args: ValidationArguments) {
    const [, column] = args.constraints;
    return `${column} already in use`;
  }
}

export function NotExists(
  entity: Function, // Entity (ex. User)
  column: string, // Column (ex. 'email')
  notLikeState: state | null = state.STATE_DISABLED, // send null to exclude this condition
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [entity, column, notLikeState],
      validator: NotExistsConstraint,
    });
  };
}
