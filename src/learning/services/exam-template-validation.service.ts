import { Injectable } from '@nestjs/common';
import { ExamTemplate } from '../entities/exam-template.entity';
import { ExamTemplateSection } from '../entities/exam-template-section.entity';
import { ExamTemplateSectionQuestion } from '../entities/exam-template-section-question.entity';

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  type: 'template' | 'section' | 'question';
  entityId: string;
  message: string;
}

@Injectable()
export class ExamTemplateValidationService {
  validateTemplate(
    template: ExamTemplate,
    isPublishing: boolean = false,
  ): ValidationResult {
    const errors: ValidationError[] = [];

    // Only validate sections if publishing or if sections exist
    if (isPublishing || (template.sections && template.sections.length > 0)) {
      // Validate template level requirements
      if (!template.sections || template.sections.length === 0) {
        errors.push({
          type: 'template',
          entityId: template.id,
          message: 'Template must have at least one section',
        });
      }

      // Validate each section
      if (template.sections) {
        template.sections.forEach((section) => {
          const sectionErrors = this.validateSection(section);
          errors.push(...sectionErrors);
        });
      }
    }

    // Validate availability dates
    if (template.availability_end_date <= template.availability_start_date) {
      errors.push({
        type: 'template',
        entityId: template.id,
        message: 'End date must be after start date',
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  private validateSection(section: ExamTemplateSection): ValidationError[] {
    const errors: ValidationError[] = [];

    // Validate time limit
    if (section.timeLimitSeconds <= 0) {
      errors.push({
        type: 'section',
        entityId: section.id,
        message: 'Section must have a positive time limit',
      });
    }

    // Validate questions
    if (!section.questions || section.questions.length === 0) {
      errors.push({
        type: 'section',
        entityId: section.id,
        message: 'Section must have at least one question',
      });
    }

    // Validate question positions
    if (section.questions) {
      const positions = section.questions.map((q) => q.position);
      const uniquePositions = new Set(positions);
      if (positions.length !== uniquePositions.size) {
        errors.push({
          type: 'section',
          entityId: section.id,
          message: 'Questions must have unique positions',
        });
      }

      // Check for gaps in positions
      const sortedPositions = [...positions].sort((a, b) => a - b);
      for (let i = 0; i < sortedPositions.length; i++) {
        if (sortedPositions[i] !== i + 1) {
          errors.push({
            type: 'section',
            entityId: section.id,
            message: 'Question positions must be sequential',
          });
          break;
        }
      }

      // Validate each question
      section.questions.forEach((question) => {
        if (!question.questionTemplate) {
          errors.push({
            type: 'question',
            entityId: question.id,
            message: 'Question template is missing',
          });
        }
      });

      // Validate difficulty distribution
      if (section.difficultyDistribution) {
        const totalPercentage = section.difficultyDistribution.reduce(
          (sum, rule) => sum + rule.percentage,
          0,
        );
        if (totalPercentage !== 100) {
          errors.push({
            type: 'section',
            entityId: section.id,
            message: 'Difficulty distribution percentages must sum to 100',
          });
        }

        // Check if actual distribution matches rules
        const questionsByDifficulty = new Map<string, number>();
        section.questions.forEach((question) => {
          const difficulty = question.questionTemplate.difficulty;
          questionsByDifficulty.set(
            difficulty,
            (questionsByDifficulty.get(difficulty) || 0) + 1,
          );
        });

        section.difficultyDistribution.forEach((rule) => {
          const expectedCount = Math.round(
            (rule.percentage / 100) * section.questions.length,
          );
          const actualCount = questionsByDifficulty.get(rule.difficulty) || 0;
          if (actualCount !== expectedCount) {
            errors.push({
              type: 'section',
              entityId: section.id,
              message: `Expected ${expectedCount} questions with difficulty ${rule.difficulty}, but found ${actualCount}`,
            });
          }
        });
      }

      // Validate topic distribution
      if (section.topicDistribution) {
        const totalPercentage = section.topicDistribution.reduce(
          (sum, rule) => sum + rule.percentage,
          0,
        );
        if (totalPercentage !== 100) {
          errors.push({
            type: 'section',
            entityId: section.id,
            message: 'Topic distribution percentages must sum to 100',
          });
        }

        // Check if actual distribution matches rules
        const questionsByTopic = new Map<string, number>();
        section.questions.forEach((question) => {
          question.questionTemplate.topics.forEach((topic) => {
            questionsByTopic.set(topic, (questionsByTopic.get(topic) || 0) + 1);
          });
        });

        section.topicDistribution.forEach((rule) => {
          const expectedCount = Math.round(
            (rule.percentage / 100) * section.questions.length,
          );
          let actualCount = 0;
          rule.topics.forEach((topic) => {
            actualCount += questionsByTopic.get(topic) || 0;
          });
          if (actualCount !== expectedCount) {
            errors.push({
              type: 'section',
              entityId: section.id,
              message: `Expected ${expectedCount} questions with topics [${rule.topics.join(
                ', ',
              )}], but found ${actualCount}`,
            });
          }
        });
      }
    }

    return errors;
  }
}
