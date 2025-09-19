import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Filter } from 'lucide-react';
import type { Question } from '../../utils/questionsData';
import { adminApi } from '../../services/adminApi';

interface LocalQuestionFormData {
  id: number;
  conversation: string[];
  questionLine: string;
  type: 'multiple_choice' | 'essay';
  options: string[];
  correctAnswer: number;
  correctAnswerText?: string;
  explanation: string;
  character: string;
  level: number;
  hint?: string;
  translation?: {
    conversation: string[];
    questionLine: string;
    options: string[];
    correctAnswerText?: string;
  };
}

const QuestionManagement: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCharacter, setFilterCharacter] = useState('');
  const [filterLevel, setFilterLevel] = useState('');
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalQuestions: 0,
    limit: 10
  });

  const characters = ['Semar', 'Gareng', 'Petruk', 'Bagong'];
  const levels = [1, 2, 3, 4];

  // Load data from API
  useEffect(() => {
    loadQuestions();
  }, []);

  useEffect(() => {
    loadQuestions();
  }, [pagination.currentPage]);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getQuestions({
        page: pagination.currentPage,
        limit: pagination.limit,
        characterId: filterCharacter,
        search: searchTerm
      });
      setQuestions(response.data);
      setFilteredQuestions(response.data);
      setPagination(prev => ({
        ...prev,
        totalPages: response.pagination?.totalPages || 1,
        totalQuestions: response.pagination?.total || 0
      }));
    } catch (error) {
      console.error('Error loading questions:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter questions based on search and filters
  useEffect(() => {
    let filtered = questions;

    if (searchTerm) {
      filtered = filtered.filter(q => 
        q.questionLine.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.explanation.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterCharacter) {
      filtered = filtered.filter(q => q.character === filterCharacter);
    }

    if (filterLevel) {
      filtered = filtered.filter(q => q.level === parseInt(filterLevel));
    }

    setFilteredQuestions(filtered);
  }, [questions, searchTerm, filterCharacter, filterLevel]);

  const handleAddQuestion = () => {
    setEditingQuestion(null);
    setIsModalOpen(true);
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setIsModalOpen(true);
  };

  const handleDeleteQuestion = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pertanyaan ini?')) {
      try {
        setLoading(true);
        await adminApi.deleteQuestion(id.toString());
        loadQuestions();
      } catch (error) {
        console.error('Error deleting question:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSaveQuestion = async (questionData: LocalQuestionFormData) => {
    try {
      setLoading(true);
      const questionPayload = {
        characterId: questionData.character,
        question: questionData.questionLine,
        questionType: questionData.type,
        options: questionData.options,
        correctAnswer: questionData.correctAnswer,
        correctAnswerText: questionData.correctAnswerText,
        explanation: questionData.explanation,
        difficulty: 'medium' as const,
        category: 'general' as const,
        points: 10,
        translation: questionData.translation
      };
      
      if (editingQuestion) {
        // Update existing question
        await adminApi.updateQuestion(editingQuestion.id.toString(), questionPayload);
      } else {
        // Add new question
        await adminApi.createQuestion(questionPayload);
      }
      setIsModalOpen(false);
      loadQuestions();
    } catch (error) {
      console.error('Error saving question:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Manajemen Pertanyaan</h2>
        <button
          onClick={handleAddQuestion}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Tambah Pertanyaan
        </button>
      </div>

      {/* Filters */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Cari pertanyaan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterCharacter}
            onChange={(e) => setFilterCharacter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Semua Karakter</option>
            {characters.map(char => (
              <option key={char} value={char}>{char}</option>
            ))}
          </select>
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Semua Level</option>
            {levels.map(level => (
              <option key={level} value={level}>Level {level}</option>
            ))}
          </select>
          <button
            onClick={() => {
              setSearchTerm('');
              setFilterCharacter('');
              setFilterLevel('');
            }}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Reset Filter
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-500">Memuat pertanyaan...</div>
        </div>
      )}

      {/* Questions Table */}
      {!loading && (
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pertanyaan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Karakter</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipe</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredQuestions.map((question) => (
                <tr key={question.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {question.id}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                    {question.questionLine}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {question.character}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Level {question.level}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      question.type === 'multiple_choice' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {question.type === 'multiple_choice' ? 'Pilihan Ganda' : 'Essay'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditQuestion(question)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteQuestion(question.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      )}

      {!loading && filteredQuestions.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Tidak ada pertanyaan yang ditemukan.
        </div>
      )}

      {/* Question Form Modal */}
      {isModalOpen && (
        <QuestionFormModal
          question={editingQuestion}
          onSave={handleSaveQuestion}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

// Question Form Modal Component
interface QuestionFormModalProps {
  question: Question | null;
  onSave: (question: LocalQuestionFormData) => void;
  onClose: () => void;
}

const QuestionFormModal: React.FC<QuestionFormModalProps> = ({ question, onSave, onClose }) => {
  const [formData, setFormData] = useState<LocalQuestionFormData>({
    id: question?.id || 0,
    conversation: question?.conversation || [''],
    questionLine: question?.questionLine || '',
    type: question?.type || 'multiple_choice',
    options: question?.options || ['', '', '', ''],
    correctAnswer: question?.correctAnswer || 0,
    correctAnswerText: question?.correctAnswerText || '',
    explanation: question?.explanation || '',
    character: question?.character || 'Semar',
    level: question?.level || 1,
    hint: question?.hint || '',
    translation: question?.translation || {
      conversation: [''],
      questionLine: '',
      options: ['', '', '', ''],
      correctAnswerText: ''
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const updateConversation = (index: number, value: string) => {
    const newConversation = [...formData.conversation];
    newConversation[index] = value;
    
    // Auto-detect new line and add new conversation line
    if (value.includes('\n')) {
      const lines = value.split('\n');
      newConversation[index] = lines[0];
      
      // Add new lines for each \n found
      const additionalLines = lines.slice(1);
      const updatedConversation = [
        ...newConversation.slice(0, index + 1),
        ...additionalLines,
        ...newConversation.slice(index + 1)
      ];
      
      // Also update translation conversation to match
       const currentTranslation = formData.translation;
       let updatedTranslationConversation: string[] | undefined;
       if (currentTranslation?.conversation) {
         const newTranslationConversation = [...currentTranslation.conversation];
         const emptyLines = additionalLines.map(() => '');
         updatedTranslationConversation = [
           ...newTranslationConversation.slice(0, index + 1),
           ...emptyLines,
           ...newTranslationConversation.slice(index + 1)
         ];
       }
      
      setFormData(prev => ({ 
        ...prev, 
        conversation: updatedConversation,
        translation: currentTranslation ? {
          ...currentTranslation,
          conversation: updatedTranslationConversation || updatedConversation.map(() => '')
        } : undefined
      }));
    } else {
      setFormData(prev => ({ ...prev, conversation: newConversation }));
    }
  };

  const addConversationLine = () => {
    setFormData(prev => ({ 
      ...prev, 
      conversation: [...prev.conversation, ''],
      translation: prev.translation ? {
        ...prev.translation,
        conversation: [...(prev.translation.conversation || []), '']
      } : undefined
    }));
  };

  const removeConversationLine = (index: number) => {
    if (formData.conversation.length > 1) {
      const newConversation = formData.conversation.filter((_, i) => i !== index);
      setFormData(prev => ({ 
        ...prev, 
        conversation: newConversation,
        translation: prev.translation ? {
          ...prev.translation,
          conversation: (prev.translation.conversation || []).filter((_, i) => i !== index)
        } : undefined
      }));
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData(prev => ({ ...prev, options: newOptions }));
  };

  const updateTranslationConversation = (index: number, value: string) => {
    const currentTranslation = formData.translation || {
      conversation: formData.conversation.map(() => ''),
      questionLine: '',
      options: formData.options.map(() => ''),
      correctAnswerText: ''
    };
    
    const newConversation = [...(currentTranslation.conversation || formData.conversation.map(() => ''))];
    newConversation[index] = value;
    
    // Auto-detect new line and add new conversation line
    if (value.includes('\n')) {
      const lines = value.split('\n');
      newConversation[index] = lines[0];
      
      // Add new lines for each \n found
      const additionalLines = lines.slice(1);
      const updatedConversation = [
        ...newConversation.slice(0, index + 1),
        ...additionalLines,
        ...newConversation.slice(index + 1)
      ];
      
      setFormData(prev => ({ 
        ...prev, 
        translation: {
          ...currentTranslation,
          conversation: updatedConversation
        }
      }));
    } else {
      setFormData(prev => ({ 
        ...prev, 
        translation: {
          ...currentTranslation,
          conversation: newConversation
        }
      }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">
            {question ? 'Edit Pertanyaan' : 'Tambah Pertanyaan Baru'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Karakter
              </label>
              <select
                value={formData.character}
                onChange={(e) => setFormData(prev => ({ ...prev, character: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="Semar">Semar</option>
                <option value="Gareng">Gareng</option>
                <option value="Petruk">Petruk</option>
                <option value="Bagong">Bagong</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Level
              </label>
              <select
                value={formData.level}
                onChange={(e) => setFormData(prev => ({ ...prev, level: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value={1}>Level 1</option>
                <option value={2}>Level 2</option>
                <option value={3}>Level 3</option>
                <option value={4}>Level 4</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipe Pertanyaan
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as 'multiple_choice' | 'essay' }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="multiple_choice">Pilihan Ganda</option>
                <option value="essay">Essay</option>
              </select>
            </div>
          </div>

          {/* Conversation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Percakapan
            </label>
            {formData.conversation.map((line, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <textarea
                  value={line}
                  onChange={(e) => updateConversation(index, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      updateConversation(index, e.currentTarget.value + '\n');
                    }
                  }}
                  placeholder={`Baris percakapan ${index + 1} (Enter untuk baris baru)`}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={1}
                  style={{ minHeight: '42px' }}
                  required
                />
                {formData.conversation.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeConversationLine(index)}
                    className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                  >
                    -
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addConversationLine}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              + Tambah Baris
            </button>
          </div>

          {/* Question Line */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pertanyaan
            </label>
            <textarea
              value={formData.questionLine}
              onChange={(e) => setFormData(prev => ({ ...prev, questionLine: e.target.value }))}
              placeholder="Masukkan pertanyaan..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              rows={3}
              required
            />
          </div>

          {/* Options (for multiple choice) */}
          {formData.type === 'multiple_choice' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pilihan Jawaban
              </label>
              {formData.options.map((option, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <span className="px-3 py-2 bg-gray-100 rounded-md font-medium">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    placeholder={`Pilihan ${String.fromCharCode(65 + index)}`}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <input
                    type="radio"
                    name="correctAnswer"
                    checked={formData.correctAnswer === index}
                    onChange={() => setFormData(prev => ({ ...prev, correctAnswer: index }))}
                    className="mt-3"
                  />
                </div>
              ))}
              <p className="text-sm text-gray-500 mt-2">
                Pilih radio button untuk menandai jawaban yang benar
              </p>
            </div>
          )}

          {/* Correct Answer Text (for essay) */}
          {formData.type === 'essay' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jawaban yang Benar
              </label>
              <input
                type="text"
                value={formData.correctAnswerText || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, correctAnswerText: e.target.value }))}
                placeholder="Masukkan jawaban yang benar..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          )}

          {/* Explanation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Penjelasan
            </label>
            <textarea
              value={formData.explanation}
              onChange={(e) => setFormData(prev => ({ ...prev, explanation: e.target.value }))}
              placeholder="Masukkan penjelasan jawaban..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              rows={3}
              required
            />
          </div>

          {/* Hint */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hint (Opsional)
            </label>
            <input
              type="text"
              value={formData.hint || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, hint: e.target.value }))}
              placeholder="Masukkan hint..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Translation Section */}
          <div className="border-t pt-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Translasi Bahasa Indonesia</h4>
            
            {/* Translation Conversation */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Percakapan (Bahasa Indonesia)
              </label>
              {(formData.translation?.conversation || formData.conversation.map(() => '')).map((line, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <textarea
                    value={line}
                    onChange={(e) => updateTranslationConversation(index, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        updateTranslationConversation(index, e.currentTarget.value + '\n');
                      }
                    }}
                    placeholder={`Terjemahan baris percakapan ${index + 1} (Enter untuk baris baru)`}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={1}
                    style={{ minHeight: '42px' }}
                  />
                </div>
              ))}
            </div>

            {/* Translation Question */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pertanyaan (Bahasa Indonesia)
              </label>
              <textarea
                value={formData.translation?.questionLine || ''}
                onChange={(e) => {
                   const currentTranslation = formData.translation || {
                     conversation: formData.conversation.map(() => ''),
                     questionLine: '',
                     options: formData.options.map(() => ''),
                     correctAnswerText: ''
                   };
                   setFormData(prev => ({ 
                     ...prev, 
                     translation: {
                       ...currentTranslation,
                       questionLine: e.target.value
                     }
                   }));
                 }}
                placeholder="Terjemahan pertanyaan dalam bahasa Indonesia..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>

            {/* Translation Options (for multiple choice) */}
            {formData.type === 'multiple_choice' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pilihan Jawaban (Bahasa Indonesia)
                </label>
                {formData.options.map((_, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <span className="px-3 py-2 bg-gray-100 rounded-md font-medium">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <input
                      type="text"
                      value={formData.translation?.options?.[index] || ''}
                      onChange={(e) => {
                         const currentTranslation = formData.translation || {
                           conversation: formData.conversation.map(() => ''),
                           questionLine: '',
                           options: formData.options.map(() => ''),
                           correctAnswerText: ''
                         };
                         const newOptions = [...(currentTranslation.options || formData.options.map(() => ''))];
                         newOptions[index] = e.target.value;
                         setFormData(prev => ({ 
                           ...prev, 
                           translation: {
                             ...currentTranslation,
                             options: newOptions
                           }
                         }));
                       }}
                      placeholder={`Terjemahan pilihan ${String.fromCharCode(65 + index)}`}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Translation Correct Answer Text (for essay) */}
            {formData.type === 'essay' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jawaban yang Benar (Bahasa Indonesia)
                </label>
                <input
                  type="text"
                  value={formData.translation?.correctAnswerText || ''}
                  onChange={(e) => {
                     const currentTranslation = formData.translation || {
                       conversation: formData.conversation.map(() => ''),
                       questionLine: '',
                       options: formData.options.map(() => ''),
                       correctAnswerText: ''
                     };
                     setFormData(prev => ({ 
                       ...prev, 
                       translation: {
                         ...currentTranslation,
                         correctAnswerText: e.target.value
                       }
                     }));
                   }}
                  placeholder="Terjemahan jawaban yang benar..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {question ? 'Update' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuestionManagement;