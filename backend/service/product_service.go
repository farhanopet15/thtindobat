package service

import (
	"THTINDOBAT/model"
	"THTINDOBAT/repository"
)

type ProductService struct {
	repo *repository.ProductRepository
}

func NewProductService(repo *repository.ProductRepository) *ProductService {
	return &ProductService{repo: repo}
}

func (s *ProductService) List() ([]model.Product, error) {
	return s.repo.List()
}

func (s *ProductService) Create(name string, stock int, price int) (*model.Product, error) {
	p := &model.Product{
		Name:  name,
		Stock: stock,
		Price: price,
	}
	if err := s.repo.Create(p); err != nil {
		return nil, err
	}
	return p, nil
}