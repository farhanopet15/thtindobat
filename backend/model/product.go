package model

import "time"

type Product struct {
	ID		uint      `json:"id" gorm:"primaryKey"`
	Name    string    `json:"name" gorm:"not null"`
	Stock   int       `json:"stock" gorm:"not null"`
	Price   int       `json:"price" gorm:"not null"`
	CreatedAt time.Time `json:"crreated_at"`
	UpdateAt time.Time  `json:"update_at"`
}