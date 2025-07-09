import * as mongoose from "mongoose";
import {MongooseBaseQueryOptions} from "mongoose";
import {HttpException, HttpStatus} from "@nestjs/common";

import {BaseMongoInterface, VDocument} from "../interface";
import mongodb from "mongodb";
import {IError} from "@Package/error";

export abstract class BaseMongoRepository<V>
  implements BaseMongoInterface<V>
{
  protected constructor(private readonly entityModel: mongoose.Model<V>) {}

  async create({
    doc,
    options,
  }: {
    doc: V;
    options?: mongoose.SaveOptions;
  }): Promise<VDocument<V>> {
    return await new this.entityModel(doc).save(options) as unknown as VDocument<V>;
  }

  async countDocuments({
    filter,
    options,
  }: {
    filter?: mongoose.RootFilterQuery<VDocument<V>>;
    options?: (mongodb.CountOptions & MongooseBaseQueryOptions<VDocument<V>>) | null;
  }) {
    return this.entityModel.countDocuments(filter, options);
  }

  async aggregate<T = any>({
    pipeline,
    options,
  }: {
    pipeline?: mongoose.PipelineStage[];
    options?: mongoose.AggregateOptions;
  }) {
    return this.entityModel.aggregate(pipeline, options) as unknown as T[] ;
  }

  async find({
    filter,
    projection,
    options,
  }: {
    filter?: mongoose.FilterQuery<VDocument<V>>;
    projection?: mongoose.ProjectionType<VDocument<V>>;
    options?: mongoose.QueryOptions;
  }) {
    return this.entityModel.find(filter, projection, {
      ...options,
      lean: true,
    }) as unknown as VDocument<V>[];
  }

  async findOne({
    filter,
    projection,
    options,
  }: {
    filter?: mongoose.FilterQuery<VDocument<V>>;
    projection?: mongoose.ProjectionType<VDocument<V>>;
    options?: mongoose.QueryOptions<VDocument<V>>;
  }): Promise<VDocument<V>> {
    const result = await this.entityModel.findOne(filter, projection, {
      ...options,
    });
    return result as VDocument<V>;
  }

  async findOneAndUpdate({
    filter,
    update,
    options,
  }: {
    filter: mongoose.FilterQuery<VDocument<V>>;
    update: mongoose.UpdateQuery<VDocument<V>>;
    options?: mongoose.QueryOptions<VDocument<V>>;
  }): Promise<VDocument<V>> {
    return await this.entityModel.findOneAndUpdate(filter, update, {
      ...options,
      new: true,
      lean: true,
    }) as VDocument<V>;
  }
}
